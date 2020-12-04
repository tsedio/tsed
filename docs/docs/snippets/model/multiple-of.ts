import {MultipleOf} from "@tsed/schema";

export class Model {
  @MultipleOf(10)
  prop: number;
}
