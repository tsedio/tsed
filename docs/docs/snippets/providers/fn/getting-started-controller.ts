import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {controller} from "@tsed/di";
import {Calendar} from "../models/Calendar.js";
import {CalendarsService} from "../services/CalendarsService.js";

export class CalendarsController {
  private readonly calendarsService = inject(CalendarsService);

  @Post()
  create(@BodyParams() calendar: Calendar) {
    return this.calendarsService.create(calendar);
  }

  @Get()
  findAll(): Promise<Calendar[]> {
    return this.calendarsService.findAll();
  }
}

controller(CalendarsController)
  .path("/calendars");
