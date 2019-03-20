import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Calendar} from "../models/Calendar";
import {CalendarsService} from "../services/CalendarsService";

@Controller("/calendars")
export class CatsController {
  constructor(private readonly calendarsService: CalendarsService) {
  }

  @Post()
  async create(@BodyParams() calendar: Calendar) {
    this.calendarsService.create(calendar);
  }

  @Get()
  async findAll(): Promise<Calendar[]> {
    return this.calendarsService.findAll();
  }
}
