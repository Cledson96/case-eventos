import { describe, expect, it } from "vitest";

import { extractErrorMessage, extractErrorStatus } from "./error";

const axiosErrorWithMessage = {
  isAxiosError: true,
  message: "falha de rede",
  response: { status: 409, data: { message: "E-mail ja cadastrado" } },
};

const axiosErrorWithoutMessage = {
  isAxiosError: true,
  message: "timeout",
  response: { status: 500, data: {} },
};

describe("extractErrorMessage", () => {
  it("usa a mensagem da resposta da API quando existe", () => {
    expect(extractErrorMessage(axiosErrorWithMessage)).toBe("E-mail ja cadastrado");
  });

  it("usa a mensagem do axios quando a resposta nao traz mensagem", () => {
    expect(extractErrorMessage(axiosErrorWithoutMessage)).toBe("timeout");
  });

  it("usa a mensagem de um Error comum", () => {
    expect(extractErrorMessage(new Error("quebrou"))).toBe("quebrou");
  });

  it("usa o fallback para valores desconhecidos", () => {
    expect(extractErrorMessage("algo", "padrao")).toBe("padrao");
  });
});

describe("extractErrorStatus", () => {
  it("retorna o status da resposta do axios", () => {
    expect(extractErrorStatus(axiosErrorWithMessage)).toBe(409);
  });

  it("retorna o fallback para erros nao-axios", () => {
    expect(extractErrorStatus(new Error("quebrou"), 400)).toBe(400);
  });
});
