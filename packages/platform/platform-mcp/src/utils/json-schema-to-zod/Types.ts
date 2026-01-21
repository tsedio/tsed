/**
 * JSON-compatible shape preserved when translating between schemas.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type Serializable = {[key: string]: Serializable} | Serializable[] | string | number | boolean | null;

/**
 * Minimal JSON Schema representation supported by the conversion utilities.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type JsonSchema = JsonSchemaObject | boolean;
/**
 * Object-based JSON Schema node with permissive indexing for vendor keywords.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type JsonSchemaObject = {
  // left permissive by design
  type?: string | string[];

  // object
  properties?: {[key: string]: JsonSchema};
  additionalProperties?: JsonSchema;
  unevaluatedProperties?: JsonSchema;
  patternProperties?: {[key: string]: JsonSchema};
  minProperties?: number;
  maxProperties?: number;
  required?: string[] | boolean;
  propertyNames?: JsonSchema;

  // array
  items?: JsonSchema | JsonSchema[];
  additionalItems?: JsonSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;

  // number
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  multipleOf?: number;

  // unions
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  oneOf?: JsonSchema[];

  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;

  // shared
  const?: Serializable;
  enum?: Serializable[];

  errorMessage?: {[key: string]: string | undefined};
} & {[key: string]: any};

/**
 * Function signature used to pick the correct parser for a JSON Schema node.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ParserSelector = (schema: JsonSchemaObject, refs: Refs) => string;
/**
 * Optional hook that allows callers to override parsing logic for specific nodes.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ParserOverride = (schema: JsonSchemaObject, refs: Refs) => string | void;

/**
 * Supported Zod major versions targeted by the generator.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ZodVersion = 3 | 4;

/**
 * Options accepted by {@link jsonSchemaToZod} and downstream helpers.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type Options = {
  name?: string;
  module?: "cjs" | "esm" | "none";
  withoutDefaults?: boolean;
  withoutDescribes?: boolean;
  withJsdocs?: boolean;
  parserOverride?: ParserOverride;
  depth?: number;
  type?: boolean | string;
  noImport?: boolean;
  zodVersion?: ZodVersion;
};

/**
 * Internal reference tracker used during recursive parsing.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type Refs = Options & {
  path: (string | number)[];
  seen: Map<object | boolean, {n: number; r: string | undefined}>;
};
