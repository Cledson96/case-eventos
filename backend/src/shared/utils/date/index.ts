import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");

export class AppDate {
  public static nowIso(): string {
    return dayjs().toISOString();
  }

  public static httpDate(): string {
    return dayjs().toDate().toUTCString();
  }
}
