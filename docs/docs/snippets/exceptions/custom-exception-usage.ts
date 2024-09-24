import {Controller, Inject} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

import {IDFormatException} from "../errors/IDFormatException";
import {CalendarsService} from "../services/CalendarsService";

@Controller("/calendars")
export class CalendarCtrl {
  @Inject()
  calendarsService: CalendarsService;

  @Get("/:id")
  async get(@PathParams("id") id: number) {
    if (isNaN(+id)) {
      throw new IDFormatException();
    }
  }
}
