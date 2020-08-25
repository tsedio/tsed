import {Controller, Get, UseBefore} from "@tsed/common";
import {CustomMiddleware} from "./middlewares/CustomMiddleware";

@Controller("/test")
@UseBefore(CustomMiddleware) // global to the controller
class MyCtrl {
  @Get("/")
  @UseBefore(CustomMiddleware) // only to this endpoint
  getContent() {
  }
}
