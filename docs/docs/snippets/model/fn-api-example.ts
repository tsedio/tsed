import {s} from "@tsed/schema";

enum Categories {
  CAT1 = "cat1",
  CAT2 = "cat2"
}

export const MySchema = s.object({
  unique: s.string().required(),
  indexed: s.string().minLength(3).maxLength(50),
  rate: s.number().minimum(0).maximum(100).default(0),
  category: s.enums(Categories),
  pattern: s.string().pattern(/[a-z]/),
  dateCreation: s.datetime().default(Date.now)
});

// Inferred TypeScript type from the schema (new in v8.18+)
export type MySchema = s.infer<typeof MySchema>;