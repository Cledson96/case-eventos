"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">Nao foi possivel carregar os dados</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Verifique se a API esta disponivel e tente novamente.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Tentar novamente
      </button>
    </main>
  );
}
