import {Controller, Get, PathParams} from "@tsed/common";
import {MergeParams} from "@tsed/platform-express";

@Controller("/:calendarId/events")
@MergeParams()
class EventCtrl {
  @Get("/:eventId")
  async get(
    @PathParams("calendarId") calendarId: string,
    @PathParams("eventId") eventId: string
  ) {
    console.log("calendarId =>", calendarId);
    console.log("eventId =>", eventId);
  }
}
