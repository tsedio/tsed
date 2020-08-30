import {Name, Required} from "@tsed/common";

export class Calendar {
  @Name("id")
  id: string;

  @Required()
  name: string;

  constructor({id, name}: any = {}) {
    this.id = id;
    this.name = name;
  }
}
