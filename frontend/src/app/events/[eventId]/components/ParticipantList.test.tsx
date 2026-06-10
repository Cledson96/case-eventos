import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider } from "@/components/providers/ToastProvider";
import type { EventParticipant } from "@/types";
import { ParticipantList } from "./ParticipantList";

const refresh = vi.fn();
const deleteRequest = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("axios", () => ({
  default: {
    delete: (...args: unknown[]) => deleteRequest(...args),
    isAxiosError: () => false,
  },
}));

const participant: EventParticipant = {
  id: "1",
  name: "Maria Silva",
  email: "maria@example.com",
  phone: "11999998888",
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
  registeredAt: "2026-06-08T12:00:00.000Z",
};

function renderList(participants: EventParticipant[]) {
  render(
    <ToastProvider>
      <ParticipantList participants={participants} />
    </ToastProvider>
  );
}

describe("ParticipantList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe os dados dos participantes", () => {
    renderList([participant]);

    expect(screen.getByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText(/maria@example.com/)).toBeInTheDocument();
  });

  it("permite ver o telefone completo quando o valor esta truncado", () => {
    const phone = "+55 (53) 4272-9999 ramal 123456";

    renderList([{ ...participant, phone }]);

    const phoneButton = screen.getByRole("button", {
      name: `Telefone de Maria Silva: ${phone}`,
    });

    fireEvent.click(phoneButton);

    expect(screen.getByRole("tooltip")).toHaveTextContent(phone);
  });

  it("exibe estado vazio quando nao ha participantes", () => {
    renderList([]);

    expect(screen.getByText(/Nenhum participante inscrito/)).toBeInTheDocument();
  });

  it("permite excluir participante com confirmacao inline", async () => {
    deleteRequest.mockResolvedValueOnce({ data: {} });
    renderList([participant]);

    fireEvent.click(screen.getByRole("button", { name: /excluir maria silva/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirmar exclusao de maria silva/i }));

    await waitFor(() => {
      expect(deleteRequest).toHaveBeenCalledWith("/api/participants/1");
      expect(refresh).toHaveBeenCalled();
    });
    expect(await screen.findByText("Participante excluido com sucesso")).toBeInTheDocument();
  });
});
