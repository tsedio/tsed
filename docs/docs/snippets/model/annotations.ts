import {Default, Description, Example, Title} from "@tsed/schema";

export class Model {
  @Title("title")
  @Example("example")
  @Description("Description")
  @Default("default")
  prop: string = "default";
}
