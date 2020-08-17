import {Any, Ignore, Property, Name, CollectionOf, Required, Description, Example, Title} from "@tsed/schema";

export class Task {
  @Property() public name: string = "";

  @Property() public percent: number;
}

@Title("EventModel Title")
export class EventModel {
  @Title("iD")
  @Description("Description of event model id")
  @Example("1FDCHZKH")
  @Property()
  public id: string;

  @Required()
  @Example("2017-10-15T17:05:58.106Z")
  public startDate: Date;

  @Property()
  @Required()
  // @Format("date")
  public endDate: Date;

  @Name("Name")
  @Required()
  public name: string;

  @Property(Task)
  public tasks: Task[];

  @Ignore() public _id: string;

  @Any() public mapAny: Map<string, any>;

  @Any()
  @Property()
  public anyValue: any;

  @CollectionOf(Task) public tasksMap: Map<string, Task>;
}
