import {Controller, Get, Scope} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Docs, Hidden} from "../../../../../packages/swagger/src";
import {CalendarModel} from "../../models/Calendar";
import {InnerService} from "../../services/InnerService";
import {OuterService} from "../../services/OuterService";

@Controller("/products")
@Scope("request")
@Hidden()
@Docs("hidden")
export class ProductsCtrl {
  constructor(public innerService: InnerService, public outerService: OuterService) {
    $log.debug("Controller New Instance");
    $log.debug("innerService == outerService.innerService? ", innerService === outerService.innerService);
  }

  @Get("/")
  async renderCalendars(): Promise<CalendarModel[]> {
    return [{id: "1", name: "test"}];
  }

  $onDestroy() {
    $log.debug("Destroy controller");
  }
}
