import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-black/15 p-10 text-center dark:border-white/20">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Nenhum evento cadastrado ainda.</p>
      <Link href="/events/new" className="mt-3 inline-block text-sm font-medium hover:underline">
        Criar o primeiro evento
      </Link>
    </div>
  );
}
