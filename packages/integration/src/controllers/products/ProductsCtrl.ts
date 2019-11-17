import {BodyParams, Controller, Get, Post, Scope} from "@tsed/common";
import {Docs, Hidden} from "@tsed/swagger";
import {$log} from "ts-log-debug";
import {CalendarModel} from "../../models/Calendar";
import {AdminProductPostModel, UserProductPostModel} from "../../models/Product";
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

  @Post("/admin")
  public async postAdminProduct(@BodyParams() strictBodyCheck: AdminProductPostModel): Promise<AdminProductPostModel> {
    console.log(strictBodyCheck.categoryId);
    // correctly throws if categoryId is not set
    // swagger documentation correctly shows categoryId as required

    return strictBodyCheck;
  }

  @Post("/user")
  public async postUserProduct(@BodyParams() strictBodyCheck: UserProductPostModel): Promise<UserProductPostModel> {
    console.log(strictBodyCheck.categoryId);
    // wont throw if received even though ModelStrict is set to true
    // swagger documentation also shows categoryId as property although it should be ignored.
    // categoryId is also sent in response

    return strictBodyCheck;
  }
}
