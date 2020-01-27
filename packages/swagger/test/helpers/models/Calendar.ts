import {Property, Required} from "@tsed/common";

export class Calendar {
  @Property("id")
  id: string;

  @Required()
  name: string;

  constructor({id, name}: any = {}) {
    this.id = id;
    this.name = name;
  }

}
