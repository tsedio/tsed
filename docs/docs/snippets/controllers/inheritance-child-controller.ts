import {Controller} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

import {BaseCtrl} from "./BaseCtrl";

@Controller("/child")
export abstract class ChildCtrl extends BaseCtrl {
  @Get("/:id")
  get(@PathParams("id") id: string): any {
    return {id: id};
  }
}
