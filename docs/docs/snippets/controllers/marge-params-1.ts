import {Controller, Get, PathParams} from "@tsed/common";

@Controller("/:calendarId/events")
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
