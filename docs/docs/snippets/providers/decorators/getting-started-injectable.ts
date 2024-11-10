import {Injectable, ProviderScope, ProviderType} from "@tsed/di";
import {Calendar} from "../models/Calendar.js";

@Injectable({
  type: ProviderType.SERVICE,
  scope: ProviderScope.SINGLETON
})
export class CalendarsService {
  private readonly calendars: Calendar[] = [];

  create(calendar: Calendar) {
    this.calendars.push(calendar);
  }

  findAll(): Calendar[] {
    return this.calendars;
  }
}
