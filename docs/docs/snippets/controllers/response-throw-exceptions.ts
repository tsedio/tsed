import {Controller, Get, PathParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@PathParams("id") id: number): any {
    if (isNaN(+id)) {
      throw(new BadRequest("Not a number"));
    }

    return {id};
  }
}
