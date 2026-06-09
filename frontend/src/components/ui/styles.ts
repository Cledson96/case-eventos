export const fieldLabel = "block text-sm font-medium";

export function fieldControlClass(hasError = false): string {
  const base =
    "mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-colors";
  const state = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-black/15 focus:border-brand dark:border-white/20";

  return `${base} ${state}`;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const buttonPrimary = `inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const buttonSecondary = `inline-flex items-center justify-center rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/40 dark:border-white/20 dark:hover:border-white/50 ${focusRing}`;
