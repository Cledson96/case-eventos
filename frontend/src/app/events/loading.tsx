import { PageContainer } from "@/components/layout/PageContainer";

export default function Loading() {
  return (
    <PageContainer className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <li
            key={index}
            className="flex gap-4 rounded-xl border border-black/10 p-5 dark:border-white/15"
          >
            <div className="size-14 shrink-0 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-2/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-black/5 dark:bg-white/5" />
              <div className="h-3 w-full animate-pulse rounded bg-black/5 dark:bg-white/5" />
            </div>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
