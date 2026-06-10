import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider } from "@/components/providers/ToastProvider";
import { CreateEventForm } from "./CreateEventForm";

const push = vi.fn();
const refresh = vi.fn();
const post = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("axios", () => ({
  default: {
    post: (...args: unknown[]) => post(...args),
    isAxiosError: () => false,
  },
}));

function renderForm() {
  render(
    <ToastProvider>
      <CreateEventForm />
    </ToastProvider>
  );
}

describe("CreateEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envia o payload e mostra toast de sucesso", async () => {
    post.mockResolvedValueOnce({ data: {} });
    renderForm();

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Show de TI" } });
    fireEvent.change(screen.getByLabelText("Descricao"), { target: { value: "Evento anual" } });
    fireEvent.change(screen.getByLabelText("Data"), { target: { value: "2026-06-08T14:30" } });

    fireEvent.click(screen.getByRole("button", { name: /criar evento/i }));

    expect(await screen.findByText("Evento criado com sucesso")).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith("/api/events", {
      name: "Show de TI",
      description: "Evento anual",
      date: "2026-06-08T14:30",
    });
  });

  it("bloqueia duplo envio enquanto a requisicao esta em andamento", async () => {
    let resolvePost: (value: { data: unknown }) => void = () => {};
    post.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePost = resolve;
      })
    );
    renderForm();

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Show de TI" } });
    fireEvent.change(screen.getByLabelText("Descricao"), { target: { value: "Evento anual" } });
    fireEvent.change(screen.getByLabelText("Data"), { target: { value: "2026-06-08T14:30" } });

    const submitButton = screen.getByRole("button", { name: /criar evento/i });

    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    expect(post).toHaveBeenCalledTimes(1);

    resolvePost({ data: {} });

    await waitFor(() => {
      expect(screen.getByText("Evento criado com sucesso")).toBeInTheDocument();
    });
  });
});
