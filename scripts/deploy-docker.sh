#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/case-eventos}"
DEPLOY_ENVIRONMENT="${DEPLOY_ENVIRONMENT:-production}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-case-eventos-${DEPLOY_ENVIRONMENT}}"
COMPOSE_FILE="${COMPOSE_FILE:-${DEPLOY_PATH}/deploy/docker-compose.vps.yml}"
NGINX_HTTP_TEMPLATE="${NGINX_HTTP_TEMPLATE:-${DEPLOY_PATH}/deploy/nginx/reverse-proxy-http.conf}"
NGINX_HTTPS_TEMPLATE="${NGINX_HTTPS_TEMPLATE:-${DEPLOY_PATH}/deploy/nginx/reverse-proxy-https.conf}"
FRONTEND_DOMAIN="${FRONTEND_DOMAIN:?FRONTEND_DOMAIN obrigatoria}"
BACKEND_DOMAIN="${BACKEND_DOMAIN:?BACKEND_DOMAIN obrigatoria}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-3333}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
HEALTHCHECK_ATTEMPTS="${HEALTHCHECK_ATTEMPTS:-12}"
HEALTHCHECK_SLEEP_SECONDS="${HEALTHCHECK_SLEEP_SECONDS:-5}"
PORT_SCAN_LIMIT="${PORT_SCAN_LIMIT:-20}"
APT_UPDATED=0
SELECTED_PORT=""

log() {
  printf '[deploy] %s\n' "$1"
}

sudo_run() {
  if [ "$(id -u)" -eq 0 ]; then "$@"; else sudo -n "$@"; fi
}

ensure_apt_updated() {
  if [ "${APT_UPDATED}" -eq 0 ]; then
    sudo_run apt-get update
    APT_UPDATED=1
  fi
}

ensure_package() {
  if ! dpkg -s "$1" >/dev/null 2>&1; then
    ensure_apt_updated
    sudo_run env DEBIAN_FRONTEND=noninteractive apt-get install -y "$1"
  fi
}

ensure_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    log "docker disponivel: $(docker --version)"
    return
  fi

  ensure_package ca-certificates
  ensure_package curl
  sudo_run install -m 0755 -d /etc/apt/keyrings

  if [ ! -f /etc/apt/keyrings/docker.asc ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo_run tee /etc/apt/keyrings/docker.asc >/dev/null
    sudo_run chmod a+r /etc/apt/keyrings/docker.asc
  fi

  if [ ! -f /etc/apt/sources.list.d/docker.list ]; then
    . /etc/os-release
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" | sudo_run tee /etc/apt/sources.list.d/docker.list >/dev/null
    APT_UPDATED=0
  fi

  ensure_apt_updated
  sudo_run env DEBIAN_FRONTEND=noninteractive apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo_run systemctl enable --now docker
}

ensure_web_packages() {
  ensure_package curl
  ensure_package nginx
  ensure_package certbot
  ensure_package python3-certbot-nginx
  sudo_run systemctl enable --now nginx
  sudo_run systemctl enable --now certbot.timer >/dev/null 2>&1 || true
}

port_is_in_use() {
  local port="$1"
  sudo_run ss -ltnH "( sport = :${port} )" 2>/dev/null | grep -q .
}

port_is_current_compose_service() {
  local service="$1"
  local container_port="$2"
  local host_port="$3"
  local container_ids=""

  container_ids="$(sudo_run env COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME}" docker compose --env-file "${DEPLOY_PATH}/.env" -f "${COMPOSE_FILE}" ps -q "${service}" 2>/dev/null || true)"

  [ -n "${container_ids}" ] || return 1

  for container_id in ${container_ids}; do
    if sudo_run docker port "${container_id}" "${container_port}/tcp" 2>/dev/null | grep -q "127.0.0.1:${host_port}$"; then
      return 0
    fi
  done

  return 1
}

select_runtime_port() {
  local service="$1"
  local container_port="$2"
  local requested_port="$3"
  local candidate_port="${requested_port}"
  local max_port=$((requested_port + PORT_SCAN_LIMIT))

  while [ "${candidate_port}" -le "${max_port}" ]; do
    if ! port_is_in_use "${candidate_port}" || port_is_current_compose_service "${service}" "${container_port}" "${candidate_port}"; then
      SELECTED_PORT="${candidate_port}"
      log "${service} usando porta ${SELECTED_PORT}"
      return
    fi

    candidate_port=$((candidate_port + 1))
  done

  log "nenhuma porta livre encontrada para ${service} entre ${requested_port} e ${max_port}"
  exit 1
}

render_template() {
  local template_path="$1"
  local domain="$2"
  local port="$3"

  sed \
    -e "s|__APP_DOMAIN__|${domain}|g" \
    -e "s|__APP_PORT__|${port}|g" \
    "${template_path}"
}

certificate_exists() {
  local domain="$1"

  [ -f "/etc/letsencrypt/live/${domain}/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/${domain}/privkey.pem" ]
}

render_domain_config() {
  local domain="$1"
  local port="$2"

  if certificate_exists "${domain}"; then
    render_template "${NGINX_HTTPS_TEMPLATE}" "${domain}" "${port}"
  else
    render_template "${NGINX_HTTP_TEMPLATE}" "${domain}" "${port}"
  fi
}

publish_nginx_config() {
  local config_path="/etc/nginx/sites-available/${COMPOSE_PROJECT_NAME}.conf"
  local temp_config=""

  temp_config="$(mktemp)"
  render_domain_config "${FRONTEND_DOMAIN}" "${FRONTEND_PORT}" > "${temp_config}"
  printf '\n' >> "${temp_config}"
  render_domain_config "${BACKEND_DOMAIN}" "${BACKEND_PORT}" >> "${temp_config}"

  sudo_run install -m 0644 "${temp_config}" "${config_path}"
  rm -f "${temp_config}"
  sudo_run ln -sf "${config_path}" "/etc/nginx/sites-enabled/${COMPOSE_PROJECT_NAME}.conf"
}

reload_nginx() {
  sudo_run nginx -t
  sudo_run systemctl reload nginx
}

issue_certificate_if_missing() {
  local domain="$1"

  if certificate_exists "${domain}"; then
    log "certificado ja existe para ${domain}"
    return
  fi

  if [ -n "${CERTBOT_EMAIL}" ]; then
    sudo_run certbot --nginx -d "${domain}" --redirect --email "${CERTBOT_EMAIL}" --agree-tos --non-interactive --keep-until-expiring
  else
    sudo_run certbot --nginx -d "${domain}" --redirect --register-unsafely-without-email --agree-tos --non-interactive --keep-until-expiring
  fi
}

compose() {
  sudo_run env COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME}" FRONTEND_PORT="${FRONTEND_PORT}" BACKEND_PORT="${BACKEND_PORT}" docker compose --env-file "${DEPLOY_PATH}/.env" -f "${COMPOSE_FILE}" "$@"
}

print_compose_logs() {
  compose ps || true
  compose logs --tail=80 backend frontend || true
}

wait_for_url() {
  local name="$1"
  local url="$2"
  local attempt=1

  until curl --fail --silent --show-error "${url}" >/dev/null; do
    if [ "${attempt}" -ge "${HEALTHCHECK_ATTEMPTS}" ]; then
      log "healthcheck de ${name} falhou apos ${HEALTHCHECK_ATTEMPTS} tentativas"
      print_compose_logs
      exit 1
    fi

    log "healthcheck de ${name} tentativa ${attempt}/${HEALTHCHECK_ATTEMPTS}"
    attempt=$((attempt + 1))
    sleep "${HEALTHCHECK_SLEEP_SECONDS}"
  done
}

if [ "${FRONTEND_DOMAIN}" = "${BACKEND_DOMAIN}" ]; then
  log "FRONTEND_DOMAIN e BACKEND_DOMAIN devem ser diferentes"
  exit 1
fi

ensure_docker
ensure_web_packages

if [ -n "${GHCR_TOKEN:-}" ] && [ -n "${GHCR_USER:-}" ]; then
  echo "${GHCR_TOKEN}" | sudo_run docker login ghcr.io -u "${GHCR_USER}" --password-stdin
fi

select_runtime_port frontend 3000 "${FRONTEND_PORT}"
FRONTEND_PORT="${SELECTED_PORT}"
select_runtime_port backend 3333 "${BACKEND_PORT}"
BACKEND_PORT="${SELECTED_PORT}"

compose pull
compose up -d --remove-orphans

publish_nginx_config
reload_nginx
issue_certificate_if_missing "${FRONTEND_DOMAIN}"
issue_certificate_if_missing "${BACKEND_DOMAIN}"
publish_nginx_config
reload_nginx

wait_for_url backend "http://127.0.0.1:${BACKEND_PORT}/health"
wait_for_url frontend "http://127.0.0.1:${FRONTEND_PORT}/"

log "deploy concluido em ${DEPLOY_ENVIRONMENT}"
