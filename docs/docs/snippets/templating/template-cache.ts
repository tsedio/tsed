import {Controller} from "@tsed/di";
import {View} from "@tsed/platform-views";
import {Get} from "@tsed/schema";

@Controller("/events")
export class EventCtrl {
  @Get("/:id")
  @View("event.ejs", {cache: true})
  public get(): any {
    return {startDate: new Date(), name: "MyEvent"};
  }
}
