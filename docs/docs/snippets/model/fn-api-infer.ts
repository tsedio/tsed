import {s} from "@tsed/schema";

// Basic primitives
const Name = s.string();
const Age = s.number();

// Dates infer as Date by default (aligned with @tsed/json-mapper)
const CreatedAt = s.datetime();
const TimeOfDay = s.time();

// Collections
const Tags = s.set(s.string()); // Set<string>
const FlagsByKey = s.map(s.boolean()); // Record<string, boolean>

// Object with nested schemas
export const UserSchema = s.object({
  id: s.string().required(),
  email: s.string().optional(),
  profile: s.object({
    firstName: s.string(),
    lastName: s.string().optional()
  })
});

// any():
// - without args => any
// - with args => tuple of provided types
const AnyValue = s.any(); // any
const MixedTuple = s.any(s.string(), s.number(), s.boolean()); // [string, number, boolean]

// Infer a TS type from a schema
export type User = s.infer<typeof UserSchema>;
