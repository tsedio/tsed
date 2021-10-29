import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {MinLength, Required} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  updatePayload(@BodyParams() @Required() @MinLength(3) payload: string): any {
    console.log("payload", payload);

    return payload;
  }
}
