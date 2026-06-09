import { DateTile } from "@/components/ui/DateTile";
import { Typography } from "@/components/ui/Typography";
import { AppDate } from "@/utils/date";

type EventPreviewProps = {
  name: string;
  description: string;
  date: string;
};

export function EventPreview({ name, description, date }: EventPreviewProps) {
  return (
    <div className="lg:sticky lg:top-20">
      <Typography as="p" variant="label" className="mb-2 text-zinc-500">
        Previa
      </Typography>

      <div className="flex gap-4 rounded-xl border border-border p-5">
        {date ? (
          <DateTile date={date} />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-black/20 text-zinc-400 dark:border-white/20">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <Typography
            variant="card-title"
            as="p"
            className={`truncate ${name ? "" : "text-zinc-400"}`}
          >
            {name || "Nome do evento"}
          </Typography>
          <Typography variant="body-muted" as="p" className="mt-1 truncate">
            {date ? AppDate.weekdayTime(date) : "Selecione a data"}
          </Typography>
          {description && (
            <Typography variant="body-sm" as="p" className="mt-1 line-clamp-2">
              {description}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
