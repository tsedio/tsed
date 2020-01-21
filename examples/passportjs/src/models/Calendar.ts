import {Description} from "@tsed/swagger";

export class Calendar {
  @Description("Database assigned id")
  _id: string;

  @Description("Calendar name")
  name: string;

  @Description("Calendar owner")
  owner: string;
}
