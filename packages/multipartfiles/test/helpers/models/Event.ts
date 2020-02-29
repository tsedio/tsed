import {Property, PropertyType, Required} from "@tsed/common";

export class Task {
  @Property()
  id: string;

  @Property()
  title: string;
}

export class Event {
  @Property()
  @Required()
  id: string;

  @PropertyType(Task)
  tasks: Task[];
}
