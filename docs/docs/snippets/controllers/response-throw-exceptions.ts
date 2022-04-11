import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@PathParams("id") id: number): any {
    if (isNaN(+id)) {
      throw new BadRequest("Not a number");
    }

    return {id};
  }
}
