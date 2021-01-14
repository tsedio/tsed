import {BodyParams, Controller, Post} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  updatePayload(@BodyParams() payload: string): any {
    console.log("payload", payload);

    return payload;
  }
}
