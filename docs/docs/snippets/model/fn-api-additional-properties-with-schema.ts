import {s} from "@tsed/schema";

export const MySchema = s.object({
  id: s.string()
}).additionalProperties(s.string());