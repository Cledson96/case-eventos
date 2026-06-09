import { describe, expect, it } from "vitest";

import { maskPhone, onlyDigits } from "./mask";

describe("maskPhone", () => {
  it("formata celular com 11 digitos", () => {
    expect(maskPhone("11988887777")).toBe("(11) 98888-7777");
  });

  it("formata fixo com 10 digitos", () => {
    expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
  });

  it("formata parcialmente enquanto digita", () => {
    expect(maskPhone("11")).toBe("(11");
    expect(maskPhone("119")).toBe("(11) 9");
  });

  it("ignora caracteres nao numericos e limita a 11 digitos", () => {
    expect(maskPhone("(11) 98888-7777 99")).toBe("(11) 98888-7777");
  });

  it("retorna vazio para entrada sem digitos", () => {
    expect(maskPhone("abc")).toBe("");
  });
});

describe("onlyDigits", () => {
  it("mantem apenas numeros", () => {
    expect(onlyDigits("(11) 98888-7777")).toBe("11988887777");
  });
});
