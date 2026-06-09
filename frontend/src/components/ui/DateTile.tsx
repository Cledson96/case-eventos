import { AppDate } from "@/utils/date";

type DateTileProps = {
  date: string;
  size?: "md" | "lg";
};

export function DateTile({ date, size = "md" }: DateTileProps) {
  const box = size === "lg" ? "size-16" : "size-14";
  const day = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div
      className={`flex ${box} shrink-0 flex-col items-center justify-center rounded-lg bg-brand-soft text-brand-strong`}
    >
      <span className={`${day} font-semibold leading-none`}>{AppDate.day(date)}</span>
      <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide">
        {AppDate.month(date)}
      </span>
    </div>
  );
}
