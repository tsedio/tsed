import {s} from "@tsed/schema";
import {Model1} from "./Model1.js";
import {Model2} from "./Model2.js";

export const MySchema = s.object({
  prop2: s.string().required().nullable(),
  prop3: s.oneOf(Model1, Model2).required().nullable()
});