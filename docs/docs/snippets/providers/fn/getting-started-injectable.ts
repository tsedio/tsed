import {ProviderScope, ProviderType} from "@tsed/di";
import {Calendar} from "../models/Calendar.js";

export class CalendarsService {
  private readonly calendars: Calendar[] = [];

  create(calendar: Calendar) {
    this.calendars.push(calendar);
  }

  findAll(): Calendar[] {
    return this.calendars;
  }
}

injectable(CalendarsService)
  .type(ProviderType.SERVICE)
  .scope(ProviderScope.SINGLETON);
