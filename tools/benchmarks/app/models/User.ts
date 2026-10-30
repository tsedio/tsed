import {Integer, Property} from "@tsed/schema";

export class User {
  @Integer()
  id: number;

  @Integer()
  page: number;

  @Property()
  name: string;
}
