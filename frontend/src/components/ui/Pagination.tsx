import Link from "next/link";

import { Typography } from "@/components/ui/Typography";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  ariaLabel?: string;
  hash?: string;
  query?: Record<string, string | number | undefined>;
};

const linkClass =
  "inline-flex min-h-11 items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:border-white/50";

const disabledClass =
  "min-h-11 cursor-not-allowed border-border px-3 py-2 text-sm font-medium opacity-40";

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function Pagination({
  page,
  totalPages,
  basePath,
  ariaLabel = "Paginacao",
  hash = "",
  query = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }

    params.set("page", String(target));

    return `${basePath}?${params.toString()}${hash}`;
  };
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="mt-5 flex flex-wrap items-center justify-between gap-3" aria-label={ariaLabel}>
      {hasPrev ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={linkClass}>
          <ChevronLeft />
          Anterior
        </Link>
      ) : (
        <span className={`inline-flex items-center gap-1 rounded-md border ${disabledClass}`}>
          <ChevronLeft />
          Anterior
        </span>
      )}

      <Typography variant="body-muted" as="span">
        Pagina {page} de {totalPages}
      </Typography>

      {hasNext ? (
        <Link href={hrefFor(page + 1)} rel="next" className={linkClass}>
          Proxima
          <ChevronRight />
        </Link>
      ) : (
        <span className={`inline-flex items-center gap-1 rounded-md border ${disabledClass}`}>
          Proxima
          <ChevronRight />
        </span>
      )}
    </nav>
  );
}
