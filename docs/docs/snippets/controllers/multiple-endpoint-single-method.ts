import {Controller} from "@tsed/di";
import {Get, Post} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  @Get("/alias/:id")
  @Post("/:id/complexAlias")
  async get(): Promise<any> {
    return "Return something";
  }
}
