import {Property, Required} from "@tsed/common";
import {Description, Example, Title} from "@tsed/swagger";

export class CalendarModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("example1", "Description example")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}
