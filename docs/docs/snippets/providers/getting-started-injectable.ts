import {Injectable, ProviderScope, ProviderType} from "@tsed/common";
import {Calendar} from "../models/Calendar";

@Injectable({
  type: ProviderType.CONTROLLER,
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
