import {Schema} from "@tsed/schema";

export class Model {
  @Schema({
    contains: {
      type: "string"
    }
  })
  prop: string;
}
