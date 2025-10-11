import type {JsonSchema} from "../domain/JsonSchema.js";

// Phantom-typed schema shape that carries an inferred Type parameter at the type level only
export type SchemaShape<T> = JsonSchema & {readonly __tsed_infer?: T};

// Extract the inferred Type parameter from a SchemaShape
export type Infer<S> = S extends {readonly __tsed_infer?: infer T} ? T : never;

// Chainable typed methods — compile-time only typing overlay for JsonSchema methods
export interface TypedChain<T> {
  optional(): SchemaShape<T | undefined>;

  nullable(): SchemaShape<T | null>;

  default(value: T): SchemaShape<T>; // documentation-only; does not change type
  required(): SchemaShape<NonNullable<T>>;
}

export type TypedJsonSchema<T> = SchemaShape<T> & JsonSchema & TypedChain<T>;

// Helper to map object properties definition to a concrete TS type
export type PropsToShape<P extends Record<string, SchemaShape<any>>> = {
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
