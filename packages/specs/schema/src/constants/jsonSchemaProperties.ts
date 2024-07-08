export const MANY_OF_PROPERTIES = ["oneOf", "allOf", "anyOf"];
export const STRING_PROPERTIES = ["minLength", "maxLength", "pattern", "format"];
export const BOOLEAN_PROPERTIES = [];
export const NUMBER_PROPERTIES = ["minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf"];
export const ARRAY_PROPERTIES = ["maxItems", "minItems", "uniqueItems", "items", "contains", "maxContains", "minContains"];
export const OBJECT_PROPERTIES = [
  "maxItems",
  "minItems",
  "uniqueItems",
  "items",
  "contains",
  "maxContains",
  "minContains",
  "patternProperties",
  "dependencies"
];
export const COMMON_PROPERTIES = ["const", "enum"];
