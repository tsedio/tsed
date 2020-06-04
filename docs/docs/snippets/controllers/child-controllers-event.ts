import {Controller, Get, RouteService, ServerLoader, ServerSettings} from "@tsed/common";

@Controller("/events")
export class EventCtrl {
  @Get()
  get() {
  }
}
