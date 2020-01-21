import {Format, Property, PropertyType} from "@tsed/common";
import {Task} from "./Task";

export class Event {
  @Property()
  _id: string;

  @Property()
  calendarId: string;

  @Format("date-time")
  startDate: string;

  @Format("date-time")
  endDate: string;

  @Property()
  name: string;

  @PropertyType(Task)
  tasks?: Task[];
}
