import {Middleware, PathParams} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Required} from "@tsed/schema";
import {CalendarsService} from "../services/calendars/CalendarsService";

@Middleware()
export class CheckCalendarIdMiddleware {
  constructor(private calendarService: CalendarsService) {
  }

  async use(@Required() @PathParams("calendarId") calendarId: string) {
    const calendar = await this.calendarService.find(calendarId);

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }
  }
}
