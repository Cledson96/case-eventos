import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export class AppDate {
  public static format(value: string): string {
    return dayjs(value).format("D [de] MMMM [de] YYYY [as] HH:mm");
  }

  public static day(value: string): string {
    return dayjs(value).format("D");
  }

  public static month(value: string): string {
    return dayjs(value).format("MMM").replace(".", "").toUpperCase();
  }

  public static weekdayTime(value: string): string {
    return dayjs(value).format("ddd[,] HH:mm").replace(".", "");
  }

  public static shortDate(value: string): string {
    return dayjs(value).format("D [de] MMM [de] YYYY").replace(".", "");
  }
}
