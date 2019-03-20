import {Controller, Get, Render} from "@tsed/common";

@Controller("/events")
export class EventCtrl {

  @Get("/:id")
  @Render("eventCard.ejs")
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
