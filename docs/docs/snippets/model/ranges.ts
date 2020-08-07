import {ExclusiveMaximum, Minimum} from "@tsed/common";

export class Model {
  @Minimum(0)
  @ExclusiveMaximum(100)
  prop: number;
}
