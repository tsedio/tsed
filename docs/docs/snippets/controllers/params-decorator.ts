import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {CalendarModel} from "../models/CalendarModel";
import {PayloadModel} from "../models/PayloadModel";

@Controller("/calendars")
export class CalendarCtrl {
  @Post()
  updatePayload(@BodyParams() payload: PayloadModel): any {
    console.log("payload", payload);

    return payload;
  }

  @Post()
  updateCalendar(@BodyParams("calendar") calendar: CalendarModel): any {
    console.log("calendar", calendar);

    return calendar;
  }

  @Post()
  updatePayloads(@BodyParams(PayloadModel) payloads: PayloadModel[]): any {
    console.log("payloads", payloads);

    return payloads;
  }

  @Post()
  updateCalendars(@BodyParams("calendars", CalendarModel) calendars: CalendarModel[]): any {
    console.log("calendars", calendars);

    return calendars;
  }
}
