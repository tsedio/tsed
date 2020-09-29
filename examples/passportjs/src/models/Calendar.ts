import {Description} from "@tsed/schema";

export class CalendarCreation {
  @Description("Calendar name")
  name: string;
}

export class Calendar extends CalendarCreation {
  @Description("Database assigned id")
  _id: string;

  @Description("Calendar owner")
  owner: string;
}
