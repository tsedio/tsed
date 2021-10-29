import {Description, Example, Property, Title} from "@tsed/schema";

export class CalendarModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("Description example")
  @Property()
  public id: string;

  @Property()
  public name: string;
}
