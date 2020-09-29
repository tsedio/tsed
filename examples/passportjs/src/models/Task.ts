import {Property} from "@tsed/schema";

export class Task {
  @Property()
  name: string;

  @Property()
  percent: number;
}
