import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {CalendarsService} from "../services/CalendarsService";

@Controller("/calendars")
export class CalendarCtrl {
  @Inject()
  calendarsService: CalendarsService;

  @Get("/:id")
  async get(@PathParams("id") id: number) {
    if (isNaN(+id)) {
      const error = new BadRequest("Not a number");

      // Additionally
      error.setHeaders({
        "x-header": "value"
      });

      error.errors = [{message: "ID is not a number"}];

      throw error;
    }

    const calendar = await this.calendarsService.get(id);

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }

    return calendar;
  }
}
