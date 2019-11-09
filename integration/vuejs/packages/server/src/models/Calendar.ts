import {Property, Required} from "@tsed/common";

export class CreateCalendar {
  @Required()
  name: string;
}

export class Calendar extends CreateCalendar {
  @Property()
  id: string;

  @Required()
  name: string;

  @Property()
  owner: string;
}
