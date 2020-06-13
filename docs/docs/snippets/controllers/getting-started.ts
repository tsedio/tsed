import {BodyParams, Controller, Delete, Get, Post, Render, Required} from "@tsed/common";

export interface Calendar {
  id: string;
  name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/")
  @Render("calendars/index")
  async renderCalendars(): Promise<Array<Calendar>> {
    return [{id: "1", name: "test"}];
  }

  @Post("/")
  async post(
    @Required() @BodyParams("calendar") calendar: Calendar
  ): Promise<Calendar> {
    calendar.id = "1";

    return Promise.resolve(calendar);
  }

  @Delete("/")
  async deleteItem(
    @BodyParams("calendar.id") @Required() id: string
  ): Promise<Calendar> {
    return {id, name: "calendar"};
  }
}
