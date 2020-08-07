import {MultipleOf} from "@tsed/common";

export class Model {
  @MultipleOf(10)
  prop: number;
}
