import {BodyParams, Controller, Delete, Get, PathParams, Post, Put} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Description, Required, Returns, Status, Summary} from "@tsed/schema";
import {CalendarId} from "../../../decorators/calendarId";
import {Calendar} from "../../../models/calendars/Calendar";
import {CalendarsService} from "../../../services/calendars/CalendarsService";
import {EventsCtrl} from "../events/EventsCtrl";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller({
  path: "/calendars",
  children: [EventsCtrl]
})
export class CalendarsCtrl {
  constructor(private calendarsService: CalendarsService) {}

  @Get("/:id")
  @Summary("Return a calendar from his ID")
  @(Status(200, Calendar).Description("Success"))
  async get(@PathParams("id") @CalendarId() id: string): Promise<Calendar> {
    const calendar = await this.calendarsService.find(id);

    if (calendar) {
      return calendar;
    }

    throw new NotFound("Calendar not found");
  }

  @Post("/")
  @Summary("Create a new Calendar")
  @(Returns(201, Calendar).Description("Created"))
  save(
    @Description("Calendar model")
    @BodyParams()
    @Required()
    calendar: Calendar
  ) {
    return this.calendarsService.save(calendar);
  }

  @Put("/:id")
  @Summary("Update calendar information")
  @(Returns(200, Calendar).Description("Success"))
  async update(@PathParams("id") @CalendarId() id: string, @BodyParams() @Required() calendar: Calendar): Promise<Calendar> {
    calendar._id = id;

    return this.calendarsService.save(calendar);
  }

  @Delete("/:id")
  @Summary("Remove a calendar.")
  @(Returns(204).Description("No content"))
  async remove(@PathParams("id") @CalendarId() id: string): Promise<void> {
    await this.calendarsService.remove(id);
  }

  @Get("/")
  @Summary("Return all calendars")
  @(Returns(200, Array).Of(Calendar))
  async getAllCalendars(): Promise<Calendar[]> {
    return this.calendarsService.query();
  }
}
