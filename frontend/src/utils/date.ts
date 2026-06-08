import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export class AppDate {
  public static format(value: string): string {
    return dayjs(value).format("D [de] MMMM [de] YYYY [as] HH:mm");
  }
}
