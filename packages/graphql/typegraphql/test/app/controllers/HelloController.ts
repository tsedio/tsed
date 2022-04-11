import {Controller, Get} from "@tsed/common";

@Controller("/")
export class HelloController {
  @Get("/")
  get() {
    return "hello 2";
  }
}
