import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Calendar} from "../models/Calendar";
import {CalendarsService} from "../services/CalendarsService";

@Controller("/calendars")
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Post()
  async create(@BodyParams() calendar: Calendar) {
    this.calendarsService.create(calendar);
  }

  @Get()
  async findAll(): Promise<Calendar[]> {
    return this.calendarsService.findAll();
  }
}
