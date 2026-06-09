export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="h-4 w-20 animate-pulse rounded bg-black/5 dark:bg-white/5" />

      <div className="mt-5 flex gap-5">
        <div className="size-16 shrink-0 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-7 w-2/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-44 animate-pulse rounded bg-black/5 dark:bg-white/5" />
        </div>
      </div>

      <div className="mt-6 h-16 w-full max-w-prose animate-pulse rounded bg-black/5 dark:bg-white/5" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-full animate-pulse rounded bg-black/5 dark:bg-white/5"
            />
          ))}
        </div>
        <div className="h-64 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
      </div>
    </main>
  );
}
