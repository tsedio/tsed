import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/events")
export class EventCtrl {
  @Get()
  get() {}
}
