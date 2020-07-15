import {Property, Required, Description, Example, Title} from "@tsed/schema";

export class CalendarModel {
  @Title("ID")
  @Description("Description of calendar model id")
  @Example("Description example")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}
