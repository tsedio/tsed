import {s} from "@tsed/schema";


export const MySchema = s.object({
  prop: s.number().min(0).exclusiveMaximum(100)
});