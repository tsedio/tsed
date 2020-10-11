import {BodyParams, Controller, Post} from "@tsed/common";
import {In, Security} from "@tsed/schema";
import {CalendarModel} from "./models/Calendar";

@Controller("/calendars")
export class CalendarCtrl {
  @Post("/")
  @In("authorization").Type(String).Description("Bearer authorization")
  @Security("oidc")
  async createCalendar(@BodyParams() body: any): Promise<CalendarModel> {
    return {};
  }
}
