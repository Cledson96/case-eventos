export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="h-8 w-64 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-black/5 dark:bg-white/5" />
      <div className="mt-6 h-20 animate-pulse rounded bg-black/5 dark:bg-white/5" />
    </main>
  );
}
