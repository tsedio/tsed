import type {JsonSchema} from "./JsonSchema.js";

// Extract the inferred Type parameter from a SchemaShape
export type Infer<S> = S extends JsonSchema<infer T> ? T : never;

// Helper to map object properties definition to a concrete TS type
export type PropsToShape<P extends Record<string, JsonSchema<any>>> = {
  [K in keyof P]: Infer<P[K]>;
};

// Map common constructors to their primitive/instance types for inference of from(Ctor)
export type CtorToType<C> = C extends StringConstructor
  ? string
  : C extends NumberConstructor
    ? number
    : C extends BooleanConstructor
      ? boolean
      : C extends DateConstructor
        ? Date
        : C extends ArrayConstructor
          ? any[]
          : C extends MapConstructor
            ? Record<string, any>
            : C extends SetConstructor
              ? Set<any>
              : C extends ObjectConstructor
                ? Record<string, any>
                : C extends abstract new (...args: any) => any
                  ? InstanceType<C>
                  : any;

// Utility: convert a union U to an intersection
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
