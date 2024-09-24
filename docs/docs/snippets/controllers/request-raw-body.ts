import {Controller} from "@tsed/di";
import {RawBodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  post(@RawBodyParams() payload: Buffer): string {
    return payload.toString("utf8");
  }
}
