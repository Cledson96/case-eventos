import Link from "next/link";

import { Typography } from "@/components/ui/Typography";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  hash?: string;
};

const linkClass =
  "inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:border-white/50";

const disabledClass = "cursor-not-allowed border-border px-3 py-1.5 text-sm font-medium opacity-40";

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

export function Pagination({ page, totalPages, basePath, hash = "" }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (target: number) => `${basePath}?page=${target}${hash}`;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="mt-5 flex items-center justify-between" aria-label="Paginacao de participantes">
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
