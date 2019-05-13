import {Controller, Get, PathParams} from "@tsed/common";
import {BaseCtrl} from "./BaseCtrl";

@Controller("/child")
export abstract class ChildCtrl extends BaseCtrl {
  @Get("/:id")
  get(@PathParams("id") id: string): any {
    return {id: id};
  }
}
