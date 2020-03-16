import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, Required, Status} from "@tsed/common";
import {Description, Summary} from "@tsed/swagger";
import {NotFound} from "ts-httpexceptions";
import {Calendar} from "../../models/calendars/Calendar";
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
@Controller("/calendars", EventsCtrl)
export class CalendarsCtrl {

  constructor(private calendarsService: CalendarsService) {

  }

  /**
   *
   * @param {string} id
   * @returns {Promise<ICalendar>}
   */
  @Get("/:id")
  @Summary("Return a calendar from his ID")
  @Status(200, {description: "Success", type: Calendar})
  async get(@Required() @PathParams("id") id: string): Promise<Calendar> {

    const calendar = await this.calendarsService.find(id);

    if (calendar) {
      return calendar;
    }

    throw new NotFound("Calendar not found");
  }

  /**
   *
   * @param {Calendar} calendar
   * @returns {Promise<Calendar>}
   */
  @Put("/")
  @Summary("Create a new Calendar")
  @Status(201, {description: "Created", type: Calendar})
  save(@Description("Calendar model")
       @BodyParams() calendar: Calendar) {
    return this.calendarsService.save(calendar);
  }

  /**
   *
   * @param id
   * @param calendar
   * @returns {Promise<Calendar>}
   */
  @Post("/:id")
  @Summary("Update calendar information")
  @Status(200, {description: "Success", type: Calendar})
  async update(@PathParams("id") @Required() id: string,
               @BodyParams() @Required() calendar: Calendar): Promise<Calendar> {
    console.log("====", calendar);
    calendar._id = id;

    return this.calendarsService.save
    (calendar);
  }

  /**
   *
   * @param id
   * @returns {{id: string, name: string}}
   */
  @Delete("/:id")
  @Summary("Remove a calendar.")
  @Status(204, {description: "No content"})
  async remove(@PathParams("id") id: string): Promise<void> {
    await this.calendarsService.remove(id);
  }

  @Delete("/")
  @Summary("Remove all calendars.")
  @Status(204, {description: "No content"})
  async clear(@PathParams("id") id: string): Promise<void> {
    await this.calendarsService.clear();
  }

  /**
   *
   * @returns {Promise<ICalendar[]>}
   */
  @Get("/")
  @Summary("Return all calendars")
  @Status(200, {description: "Success", type: Calendar, collectionType: Array})
  async getAllCalendars(): Promise<Calendar[]> {
    return this.calendarsService.query();
  }
}
