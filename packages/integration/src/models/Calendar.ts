import {Description, Example, Property, Required, Title} from "@tsed/common";

export class CalendarModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("Description example")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}
