import {Middleware, PathParams, Req, Required} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {User} from "../models/User";
import {CalendarsService} from "../services/calendars/CalendarsService";

@Middleware()
export class CheckCalendarIdMiddleware {
  constructor(private calendarsService: CalendarsService) {
  }

  async use(@Req("user") user: User, @Required() @PathParams("calendarId") calendarId: string) {
    const calendar = await this.calendarsService.findOne({
      _id: calendarId,
      owner: user._id
    });

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }
  }
}
