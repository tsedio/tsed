import {Controller, Get, UseBefore} from "@tsed/common";
import {AcceptMimesMiddleware} from "./AcceptMimesMiddleware";

@Controller("/test")
@UseBefore(AcceptMimesMiddleware) // global to the controller
class MyCtrl {
  @Get("/")
  @UseBefore(AcceptMimesMiddleware) // only to this endpoint
  getContent() {
  }
}
