import {Controller, Get} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  findAll(): string {
    return "This action returns all calendars";
  }
}
