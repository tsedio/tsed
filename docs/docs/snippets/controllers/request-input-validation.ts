import {Controller, Get, PathParams} from "@tsed/common";
import {MinLength} from "@tsed/schema";

@Controller("/calendars")
export class CalendarsController {
  @Get(":id")
  findOne(@PathParams("id") @MinLength(10) id: string) {
    return `This action returns a #${id} calendar`;
  }
}
