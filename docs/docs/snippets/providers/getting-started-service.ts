import {Injectable} from "@tsed/common";
import {Calendar} from "../models/Calendar";

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
