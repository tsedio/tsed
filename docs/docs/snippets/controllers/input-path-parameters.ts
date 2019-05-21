import {Controller, Get, PathParams} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@PathParams("id") id: number): any {
    return {id, name: "test"};
  }
}
