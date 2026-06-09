import Link from "next/link";

import { Typography } from "@/components/ui/Typography";

export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-black/15 p-10 text-center dark:border-white/20">
      <Typography variant="body-muted">Nenhum evento cadastrado ainda.</Typography>
      <Link href="/events/new" className="mt-3 inline-block text-sm font-medium hover:underline">
        Criar o primeiro evento
      </Link>
    </div>
  );
}
