import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Get()
  findAll(): string {
    return "This action returns all calendars";
  }
}
