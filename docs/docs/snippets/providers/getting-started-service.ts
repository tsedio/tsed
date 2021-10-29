import {Injectable} from "@tsed/di";
import {Calendar} from "../models/Calendar";

@Injectable()
export class CalendarsService {
  private readonly calendars: Calendar[] = [];

  create(calendar: Calendar) {
    this.calendars.push(calendar);
  }

  findAll(): Calendar[] {
    return this.calendars;
  }
}
