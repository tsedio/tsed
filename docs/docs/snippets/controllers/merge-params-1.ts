import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/:calendarId/events")
class EventCtrl {
  @Get("/:eventId")
  async get(@PathParams("calendarId") calendarId: string, @PathParams("eventId") eventId: string) {
    console.log("calendarId =>", calendarId);
    console.log("eventId =>", eventId);
  }
}
