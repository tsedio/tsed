import {View} from "@tsed/platform-views";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/events")
export class EventsCtrl {
  @Get("/:id")
  @View("event.ejs")
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
