import {BodyParams, Controller, Post} from "@tsed/common";
import {MinLength, Required} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  updatePayload(@BodyParams() @Required() @MinLength(3) payload: string): any {
    console.log("payload", payload);

    return payload;
  }
}
