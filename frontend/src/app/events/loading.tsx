export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="h-32 animate-pulse rounded-lg bg-black/5 dark:bg-white/5" />
        ))}
      </ul>
    </main>
  );
}
