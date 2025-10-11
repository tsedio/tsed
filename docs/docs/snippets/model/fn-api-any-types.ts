import {s} from "@tsed/schema";

export const MySchema = s.object({
  prop1: s.any(),
  prop2: s.any(String, Number, Boolean),
  prop3: s.any(String, null)
});