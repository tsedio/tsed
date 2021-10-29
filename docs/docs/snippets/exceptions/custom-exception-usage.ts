import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {CalendarsService} from "../services/CalendarsService";
import {IDFormatException} from "../errors/IDFormatException";

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
