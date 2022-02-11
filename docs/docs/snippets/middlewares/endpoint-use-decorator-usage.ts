import {UseBefore} from "@tsed/platform-middlewares";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {CustomMiddleware} from "./middlewares/CustomMiddleware";

@Controller("/test")
@UseBefore(CustomMiddleware) // global to the controller
class MyCtrl {
  @Get("/")
  @UseBefore(CustomMiddleware) // only to this endpoint
  getContent() {}
}
