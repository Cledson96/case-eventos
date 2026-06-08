import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { EventParticipant } from "@/types";
import { ParticipantList } from "./ParticipantList";

const participant: EventParticipant = {
  id: "1",
  name: "Maria Silva",
  email: "maria@example.com",
  phone: "11999998888",
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
  registeredAt: "2026-06-08T12:00:00.000Z",
};

describe("ParticipantList", () => {
  it("exibe os dados dos participantes", () => {
    render(<ParticipantList participants={[participant]} />);

    expect(screen.getByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText(/maria@example.com/)).toBeInTheDocument();
  });

  it("exibe estado vazio quando nao ha participantes", () => {
    render(<ParticipantList participants={[]} />);

    expect(screen.getByText(/Nenhum participante inscrito/)).toBeInTheDocument();
  });
});
