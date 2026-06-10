import Link from "next/link";

import { Typography } from "@/components/ui/Typography";

type EmptyStateProps = {
  description: string;
  hint?: string;
  action?: {
    href: string;
    label: string;
  };
};

export function EmptyState({ description, hint, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 p-8 text-center dark:border-white/20">
      <Typography variant="body-muted">{description}</Typography>

      {hint ? (
        <Typography variant="body-muted" className="mt-1">
          {hint}
        </Typography>
      ) : null}

      {action ? (
        <Link href={action.href} className="mt-3 inline-block text-sm font-medium hover:underline">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
