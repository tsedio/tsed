import {Controller} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

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
