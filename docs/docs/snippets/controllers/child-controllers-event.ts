import {Controller, Get} from "@tsed/common";

@Controller("/events")
export class EventCtrl {
  @Get()
  get() {
  }
}
