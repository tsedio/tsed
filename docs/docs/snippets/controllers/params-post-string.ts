import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  updatePayload(@BodyParams() payload: string): any {
    console.log("payload", payload);

    return payload;
  }
}
