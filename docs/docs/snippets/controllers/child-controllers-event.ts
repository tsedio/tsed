import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/events")
export class EventCtrl {
  @Get()
  get() {}
}
