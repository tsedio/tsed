import {Service} from "@tsed/di";
import {Calendar} from "../models/Calendar.js";

@Service()
export class CalendarsService {
  private readonly calendars: Calendar[] = [];

  create(calendar: Calendar) {
    this.calendars.push(calendar);
  }

  findAll(): Calendar[] {
    return this.calendars;
  }
}
