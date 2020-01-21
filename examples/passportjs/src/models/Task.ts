import {Property} from "@tsed/common";

export class Task {
  @Property()
  name: string;

  @Property()
  percent: number;
}
