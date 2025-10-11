import {s} from "@tsed/schema";


export const MySchema = s.object({
  country: s.string().const("United States of America")
});