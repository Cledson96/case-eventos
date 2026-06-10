import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("preserva parametros extras nos links de paginacao", () => {
    render(
      <Pagination
        page={2}
        totalPages={4}
        basePath="/events/event-1"
        ariaLabel="Paginacao de participantes"
        hash="#participantes"
        query={{ search: "maria@example.com" }}
      />
    );

    expect(screen.getByRole("navigation", { name: "Paginacao de participantes" })).toBeVisible();
    expect(screen.getByRole("link", { name: /anterior/i })).toHaveAttribute(
      "href",
      "/events/event-1?search=maria%40example.com&page=1#participantes"
    );
    expect(screen.getByRole("link", { name: /proxima/i })).toHaveAttribute(
      "href",
      "/events/event-1?search=maria%40example.com&page=3#participantes"
    );
  });
});
