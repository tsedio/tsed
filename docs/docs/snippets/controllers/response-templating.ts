import {Controller, Get, View} from "@tsed/common";

@Controller("/events")
export class EventCtrl {

  @Get("/:id")
  @View("eventCard.ejs")
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
