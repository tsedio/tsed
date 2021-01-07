import {Controller, Post, RawBodyParams} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  post(@RawBodyParams() payload: Buffer): string {
    return payload.toString("utf8");
  }
}
