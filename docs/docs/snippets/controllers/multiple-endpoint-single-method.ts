import {Get, Post} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  @Get("/alias/:id")
  @Post("/:id/complexAlias")
  async get(): Promise<any> {
    return "Return something";
  }
}
