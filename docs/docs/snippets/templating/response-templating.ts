import {Controller, Get, View} from "@tsed/common";

@Controller("/events")
export class EventsCtrl {
  @Get("/:id")
  @View("event.ejs")
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
