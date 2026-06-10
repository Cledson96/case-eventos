import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ParticipantSearch } from "./ParticipantSearch";

describe("ParticipantSearch", () => {
  it("renderiza busca por nome, email ou telefone mantendo o valor atual", () => {
    render(<ParticipantSearch eventId="event-1" search="maria@example.com" />);

    const input = screen.getByLabelText("Buscar participantes");
    const form = screen.getByRole("search", { name: "Buscar participantes do evento" });

    expect(input).toHaveValue("maria@example.com");
    expect(input).toHaveAttribute("name", "search");
    expect(input).toHaveAttribute("placeholder", "Nome, e-mail ou telefone");
    expect(form).toHaveAttribute("action", "/events/event-1#participantes");
    expect(screen.getByRole("button", { name: "Filtrar participantes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Limpar busca" })).toHaveAttribute(
      "href",
      "/events/event-1#participantes"
    );
  });

  it("nao mostra limpar busca quando nao ha filtro ativo", () => {
    render(<ParticipantSearch eventId="event-1" search="" />);

    expect(screen.queryByRole("link", { name: "Limpar busca" })).not.toBeInTheDocument();
  });
});
