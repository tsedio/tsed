import {s} from "@tsed/schema";

export const MySchema = s.object({
  phone: s.string().pattern(/^(\([0-9]{3}\))?[0-9]{3}-[0-9]{4}$/)
});