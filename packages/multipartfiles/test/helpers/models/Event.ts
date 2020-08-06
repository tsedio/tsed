import {CollectionOf, Property, Required} from "@tsed/common";

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

  @CollectionOf(Task)
  tasks: Task[];
}
