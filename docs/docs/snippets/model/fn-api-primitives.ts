import {getJsonSchema, s} from "@tsed/schema";

export const MySchema = s.object({
  prop1: s.string(),
  prop2: s.number().min(0).max(100).default(0)
});

console.log(getJsonSchema(MySchema));
