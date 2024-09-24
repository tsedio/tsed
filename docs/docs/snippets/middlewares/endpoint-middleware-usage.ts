import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

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
