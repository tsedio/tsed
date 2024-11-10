import {injectable} from "@tsed/di";
import {Calendar} from "../models/Calendar.js";

export class CalendarService {
  private readonly calendars: Calendar[] = [];

  create(calendar: Calendar) {
    this.calendars.push(calendar);
  }

  findAll(): Calendar[] {
    return this.calendars;
  }
}

injectable(CalendarsService);
