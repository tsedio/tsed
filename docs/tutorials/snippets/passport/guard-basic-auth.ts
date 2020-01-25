import {Controller, Get, Inject, QueryParams} from "@tsed/common";
import {Authorize} from "@tsed/passport";
import {Calendar} from "../models/Calendar";
import {CalendarsService} from "../service/CalendarsService";

@Controller("/calendars")
export class CalendarController {
  @Inject()
  private calendarsService: CalendarsService;

  @Get("/")
  @Authorize("basic")
  async getAll(
    @QueryParams("id") id: string,
    @QueryParams("name") name: string,
    @QueryParams("owner") owner: string
  ): Promise<Calendar[]> {
    return this.calendarsService.findAll({_id: id, name, owner});
  }
}
