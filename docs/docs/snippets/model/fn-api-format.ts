import {s} from "@tsed/schema";

export const MySchema = s.object({
  email: s.email(),
  dateCreation: s.datetime() // or s.format("date-time")
});