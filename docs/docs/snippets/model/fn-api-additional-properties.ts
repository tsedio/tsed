import {s} from "@tsed/schema";

export const MySchema = s
  .object({
    id: s.string()
  })
  .unknown(); // alias of .additionalProperties(true)