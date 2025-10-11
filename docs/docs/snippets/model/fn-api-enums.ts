import {s} from "@tsed/schema";

export enum Colors {
  RED = "red",
  AMBER = "amber",
  GREEN = "green"
}

export enum Days {
  MONDAY = 0,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY
}

export const MySchema = s.object({
  prop1: s.enums("red", "amber", "green"),
  prop2: s.enums(Colors),
  prop3: s.array().items(s.enums(Days)),
  prop4: s.enums("red", "amber", "green", null, 42).nullable()
});