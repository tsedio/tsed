import {Controller, Get, View} from "@tsed/common";

@Controller("/events")
export class EventCtrl {
  @Get("/:id")
  @View("event.ejs", {cache: true})
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
