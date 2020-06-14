import {DynamicRef, Model, Ref} from "@tsed/mongoose";
import {Enum} from "@tsed/schema";
import {ModelA} from "./modelA";
import {ModelB} from "./ModelB";

@Model()
export class MyModel {
  @DynamicRef("type")
  dynamicRef: Ref<ModelA | ModelB>;

  @Enum("Mode lA", "ModelB")
  type: string; // This field has to match the referenced model's name
}
