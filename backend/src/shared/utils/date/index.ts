import { createRequire } from "node:module";

import dayjs from "dayjs";

const require = createRequire(import.meta.url);
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

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
