import {ExclusiveMaximum, Minimum} from "@tsed/schema";

export class Model {
  @Minimum(0)
  @ExclusiveMaximum(100)
  prop: number;
}
