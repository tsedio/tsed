import {Controller, Get, PathParams, MergeParams} from "@tsed/common";

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
