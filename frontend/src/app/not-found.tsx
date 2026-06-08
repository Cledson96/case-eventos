import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">Pagina nao encontrada</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        O conteudo que voce procura nao existe ou foi removido.
      </p>
      <Link href="/events" className="mt-6 inline-block text-sm font-medium hover:underline">
        Voltar para eventos
      </Link>
    </main>
  );
}
