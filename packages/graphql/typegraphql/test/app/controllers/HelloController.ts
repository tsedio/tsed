import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/")
export class HelloController {
  @Get("/")
  get() {
    return "hello 2";
  }
}
