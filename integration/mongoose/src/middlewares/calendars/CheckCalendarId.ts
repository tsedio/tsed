import {Middleware, PathParams, Required} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {CalendarsService} from "../../services/calendars/CalendarsService";

@Middleware()
export class CheckCalendarIdMiddleware {
    constructor(private calendarService: CalendarsService) {

    }

    async use(@Required() @PathParams("calendarId") calendarId: string) {

        try {
            await this.calendarService.find(calendarId);
        } catch (er) {
            throw new NotFound("CalendarDTO not found");
        }

    }
}