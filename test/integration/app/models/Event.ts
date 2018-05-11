import {Any, IgnoreProperty, JsonProperty, PropertyType, Required} from "@tsed/common";
import {Description, Example, Title} from "@tsed/swagger";

export class Task {
  @JsonProperty() public name: string = "";

  @JsonProperty() public percent: number;
}

@Title("EventModel Title")
export class EventModel {
  @Title("iD")
  @Description("Description of event model id")
  @Example("1FDCHZKH")
  @JsonProperty()
  public id: string;

  @JsonProperty()
  @Required()
  @Example("example1", "2017-10-15T17:05:58.106Z")
  public startDate: Date;

  @JsonProperty()
  @Required()
  // @Format("date")
  public endDate: Date;

  @JsonProperty("Name")
  @Required()
  public name: string;

  @JsonProperty({use: Task})
  public tasks: Task[];

  @IgnoreProperty() public _id: string;

  @Any() public mapAny: Map<string, any>;

  @PropertyType(Task) public tasksMap: Map<string, Task>;
}
