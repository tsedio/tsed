import {Property, PropertyName, Required} from "@tsed/common";
import {Model, Ref} from "@tsed/mongoose";
import {Description} from "@tsed/swagger";
import {Calendar} from "../calendars/Calendar";

@Model()
export class CalendarEvent {
  @PropertyName("id")
  _id: string;

  @Ref(Calendar)
  @Description("Calendar ID")
  calendarId: Ref<Calendar>;

  @PropertyName("name")
  @Description("The name of the event")
  name: string;

  @Property()
  @Description("Creation's date")
  dateCreate: Date = new Date();

  @Property()
  @Description("Last modification date")
  dateUpdate: Date = new Date();

  @Property()
  @Description("Beginning date of the event")
  dateStart: Date = new Date();

  @Property()
  @Required()
  @Description("Ending date of the event")
  dateEnd: Date = new Date();

  @Property()
  @Description("Description the event")
  description: string;
}
