import {Controller} from "@tsed/di";
import {View} from "@tsed/platform-views";
import {Get} from "@tsed/schema";

@Controller("/events")
export class EventsCtrl {
  @Get("/:id")
  @View("event.ejs")
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
