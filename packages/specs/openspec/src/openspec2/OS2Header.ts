import type {OS2BaseSchema} from "./OS2Schema.js";

export interface OS2Header extends OS2BaseSchema {
  /**
   * The type of the object. The value MUST be one of `string`, `number`, `integer`, `boolean`, or `array`.
   */
  type: "string" | "number" | "integer" | "boolean" | "array";
}
