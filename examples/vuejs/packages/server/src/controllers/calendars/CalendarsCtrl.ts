import {BodyParams, Controller, Delete, Get, PathParams, Post, Put} from "@tsed/common";
import {Status, Required, Returns} from "@tsed/schema";
import {NotFound} from "@tsed/exceptions";
import {Calendar, CreateCalendar} from "../../models/Calendar";
import {CalendarsService} from "../../services/calendars/CalendarsService";
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
  children: [
    EventsCtrl
  ]
})
export class CalendarsCtrl {
  constructor(private calendarsService: CalendarsService) {
  }

  @Get("/:id")
  @Returns(200, Calendar)
  async get(@Required() @PathParams("id") id: string): Promise<Calendar> {
    const calendar = await this.calendarsService.find(id);

    if (calendar) {
      return calendar;
    }

    throw new NotFound("Calendar not found");
  }

  @Put("/")
  @Status(201, Calendar)
  save(@BodyParams() calendar: CreateCalendar): Promise<Calendar> {
    return this.calendarsService.create(calendar);
  }

  @Post("/:id")
  @Returns(200, Calendar)
  async update(@PathParams("id") @Required() id: string,
               @BodyParams() @Required() calendar: CreateCalendar): Promise<Calendar> {
    return this.calendarsService.update({id, ...calendar});
  }

  @Delete("/")
  @Status(204)
  async remove(@BodyParams("id") @Required() id: string): Promise<void> {
    await this.calendarsService.remove(id);
  }

  @Get("/")
  @Returns(200, Array).Of(Calendar)
  async getAllCalendars() {
    return this.calendarsService.query();
  }
}
