import {Description, BodyParams, Controller, Get, Post, QueryParams, Returns, ReturnsArray} from "@tsed/common";
import {Deprecated, Security, Summary} from "@tsed/swagger";
import {CalendarModel} from "./models/Calendar";

@Controller("/calendars")
export class Calendar {
  @Get("/:id")
  @Summary("Summary of this route")
  @Description("Return a calendar from the given id")
  @Returns(CalendarModel)
  @Returns(404, {description: "Not found"})
  async getCalendar(@Description("A calendar Id") @QueryParams() id: string): Promise<CalendarModel> {
    return {};
  }

  @Get("/")
  @Description("Return a list of Calendar")
  @ReturnsArray(CalendarModel)
  getCalendars(): Promise<CalendarModel[]> {
    return [];
  }

  @Get("/v0/:id")
  @Deprecated()
  @Description("Deprecated route, use /rest/calendars/:id instead of.")
  @Returns(CalendarModel)
  @Returns(404, {description: "Not found"})
  getCalendarDeprecated(@QueryParams("id") id: string): Promise<CalendarModel> {
    return {};
  }


  @Post("/")
  @Security("calendar_auth", "write:calendar", "read:calendar")
  @Returns(CalendarModel)
  async createCalendar(@BodyParams() body: any): Promise<CalendarModel> {
    return {};
  }
}
