import {Property, s} from "@tsed/schema";

class AnotherModel {
  @Property()
  name: string;
}

export const MySchema = s.object({
  id: s.string()
}).additionalProperties(AnotherModel);