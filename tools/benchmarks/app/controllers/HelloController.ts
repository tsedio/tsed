import {Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";

import {HELLO} from "../fixtures.js";

@Controller("/hello")
export class HelloController {
  @Get("/")
  @Returns(200, String)
  get() {
    return HELLO;
  }
}
