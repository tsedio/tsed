import {Get, Post, Required, Delete} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {View} from "@tsed/platform-views";
import {BodyParams} from "@tsed/platform-params";

export interface Calendar {
  id: string;
  name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/")
  @View("calendars/index")
  async renderCalendars(): Promise<Calendar[]> {
    return [{id: "1", name: "test"}];
  }

  @Post("/")
  async post(@Required() @BodyParams("calendar") calendar: Calendar): Promise<Calendar> {
    calendar.id = "1";

    return Promise.resolve(calendar);
  }

  @Delete("/")
  async deleteItem(@BodyParams("calendar.id") @Required() id: string): Promise<Calendar> {
    return {id, name: "calendar"};
  }
}
