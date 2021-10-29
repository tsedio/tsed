import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  findAll(): string {
    return "This action returns all calendars";
  }
}
