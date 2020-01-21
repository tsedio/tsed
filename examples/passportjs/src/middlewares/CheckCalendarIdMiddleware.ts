import {Middleware, PathParams, Required} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {CalendarsService} from "../services/calendars/CalendarsService";

@Middleware()
export class CheckCalendarIdMiddleware {
  constructor(private calendarsService: CalendarsService) {
  }

  async use(@Required() @PathParams("calendarId") calendarId: string) {
    const calendar = await this.calendarsService.findById(calendarId);

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }
  }
}
