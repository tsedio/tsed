import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Post,
  Put,
  QueryParams,
  Required,
  Status
} from "@tsed/common";
import {Responses, Returns} from "@tsed/swagger";
import {NotFound} from "ts-httpexceptions";
import {Calendar} from "../../models/Calendar";
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
export class CalendarCtrl {

  constructor(private calendarsService: CalendarsService) {

  }

  @Get("/:id")
  @Returns(Calendar)
  async get(@Required() @PathParams("id") id: string): Promise<Calendar> {

    const calendar = await this.calendarsService.findById(id);

    if (calendar) {
      return calendar;
    }

    throw new NotFound("Calendar not found");
  }

  @Put("/")
  @Returns(Calendar)
  save(@BodyParams("name") name: string): Promise<Calendar> {
    return this.calendarsService.create({name});
  }

  /**
   *
   * @param id
   * @param name
   * @returns {Promise<Calendar>}
   */
  @Post("/:id")
  @Returns(Calendar)
  @Responses(404, {description: "Calendar not found"})
  async update(@PathParams("id") @Required() id: string,
               @BodyParams("name") @Required() name: string): Promise<Calendar> {
    const calendar = this.calendarsService.update({_id: id, name});

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }

    return calendar;
  }

  /**
   *
   * @param id
   * @returns {{id: string, name: string}}
   */
  @Delete("/")
  @Status(204)
  @Responses(404, {description: "Calendar not found"})
  async remove(@BodyParams("id") @Required() id: string): Promise<void> {
    if (!this.calendarsService.removeOne({_id: id})) {
      throw new NotFound("Calendar not found");
    }
  }

  @Get("/")
  async getAllCalendars(
    @QueryParams("id") id: string,
    @QueryParams("name") name: string
  ): Promise<Calendar[]> {
    return this.calendarsService.findAll({_id: id, name});
  }
}
