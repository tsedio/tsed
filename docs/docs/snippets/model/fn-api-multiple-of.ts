import {s} from "@tsed/schema";

export const MySchema = s.object({
  prop1: s.number().multipleOf(10)
});

