import {Use, UseAfter, UseBefore} from "@tsed/platform-middlewares";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {CustomBeforeMdlw, CustomMiddleware} from "../middlewares/middlewares";

@Controller("/calendars")
@UseBefore(CustomBeforeMdlw)
export class CalendarCtrl {
  @Get("/:id")
  @Use(CustomMiddleware)
  get1(@PathParams("id") id: number): any {
    return {id};
  }

  @Get("/:id")
  @UseBefore(CustomMiddleware)
  get2(@PathParams("id") id: number): any {
    return {id};
  }

  @Get("/:id")
  @UseAfter(CustomMiddleware)
  get3(@PathParams("id") id: number): any {
    return {id};
  }
}
