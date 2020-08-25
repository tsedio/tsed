import {Controller, Get} from "@tsed/common";
import {Accept} from "../decorators/Accept";

@Controller("/test")
class MyCtrl {
  @Get("/")
  @Accept("application/json")
  getContent() {
    return {
      title: "title"
    };
  }
}
