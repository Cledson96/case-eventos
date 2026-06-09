import { describe, expect, it } from "vitest";

import { validateEmail, validateName, validatePhone } from "./validation";

describe("validateName", () => {
  it("exige nome", () => {
    expect(validateName("   ")).toBe("Informe o nome");
  });

  it("limita a 120 caracteres", () => {
    expect(validateName("a".repeat(121))).toBe("Maximo de 120 caracteres");
  });

  it("aceita nome valido", () => {
    expect(validateName("Ana Souza")).toBeNull();
  });
});

describe("validateEmail", () => {
  it("exige e-mail", () => {
    expect(validateEmail("")).toBe("Informe o e-mail");
  });

  it("rejeita formato invalido", () => {
    expect(validateEmail("invalido")).toBe("E-mail invalido");
  });

  it("aceita e-mail valido", () => {
    expect(validateEmail("ana@example.com")).toBeNull();
  });
});

describe("validatePhone", () => {
  it("exige telefone", () => {
    expect(validatePhone("")).toBe("Informe o telefone");
  });

  it("rejeita quantidade invalida de digitos", () => {
    expect(validatePhone("(11) 9999")).toBe("Telefone invalido");
  });

  it("aceita celular e fixo", () => {
    expect(validatePhone("(11) 98888-7777")).toBeNull();
    expect(validatePhone("(11) 3333-4444")).toBeNull();
  });
});
