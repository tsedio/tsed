import {Controller, Get, Post} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  @Get("/alias/:id")
  @Post("/:id/complexAlias")
  async get(): Promise<any> {
    return "Return something";
  }
}
