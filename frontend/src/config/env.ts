type ApiConfig = {
  apiUrl: string;
  apiToken: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente ausente: ${name}`);
  }

  return value;
}

export function getApiConfig(): ApiConfig {
  return {
    apiUrl: process.env.API_URL ?? "http://localhost:3333",
    apiToken: requireEnv("API_TOKEN"),
  };
}
