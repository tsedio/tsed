import type {JsonSchema} from "./JsonSchema.js";

/**
 * Extracts the inferred TypeScript type from a JsonSchema.
 *
 * This utility type enables type-safe schema usage by extracting the type parameter
 * from JsonSchema instances.
 *
 * ### Usage
 *
 * ```typescript
 * const userSchema = JsonSchema.from({ type: "object" });
 * type User = Infer<typeof userSchema>; // Extracts the type
 * ```
 *
 * @typeParam S - The JsonSchema to extract the type from
 *
 * @public
 */
export type Infer<S> = S extends JsonSchema<infer T> ? T : never;

/**
 * Maps an object of JsonSchema properties to a concrete TypeScript type.
 *
 * Converts a record of JsonSchema properties into a TypeScript type where each
 * property has the inferred type from its corresponding schema.
 *
 * ### Usage
 *
 * ```typescript
 * const properties = {
 *   name: string(),
 *   age: number(),
 *   email: string().format("email")
 * };
 *
 * type Shape = PropsToShape<typeof properties>;
 * // Result: { name: string; age: number; email: string }
 * ```
 *
 * @typeParam P - Record of property names to JsonSchema instances
 *
 * @public
 */
export type PropsToShape<P extends Record<string, JsonSchema<any>>> = {
  [K in keyof P]: Infer<P[K]>;
};

type JsonLikeObject = Record<string, any>;
type ObjectPortion<T> = Extract<T, JsonLikeObject>;
type NonObjectPortion<T> = Exclude<T, JsonLikeObject>;

type ObjectPick<T, K extends PropertyKey> = Pick<ObjectPortion<T>, Extract<K, keyof ObjectPortion<T>>>;
type ObjectOmit<T, K extends PropertyKey> = Omit<ObjectPortion<T>, Extract<K, keyof ObjectPortion<T>>>;
type ObjectPartial<T> = {
  [K in keyof ObjectPortion<T>]?: ObjectPortion<T>[K] | undefined;
};

type MergedObjectPortion<T, U> = [ObjectPortion<T>] extends [never]
  ? ObjectPortion<U>
  : [ObjectPortion<U>] extends [never]
    ? ObjectPortion<T>
    : ObjectPortion<T> & ObjectPortion<U>;

export type SchemaPick<T, K extends PropertyKey> = [ObjectPortion<T>] extends [never]
  ? T
  : NonObjectPortion<T> extends never
    ? ObjectPick<T, K>
    : ObjectPick<T, K> | NonObjectPortion<T>;

export type SchemaOmit<T, K extends PropertyKey> = [ObjectPortion<T>] extends [never]
  ? T
  : NonObjectPortion<T> extends never
    ? ObjectOmit<T, K>
    : ObjectOmit<T, K> | NonObjectPortion<T>;

export type SchemaPartial<T> = [ObjectPortion<T>] extends [never]
  ? T
  : NonObjectPortion<T> extends never
    ? ObjectPartial<T>
    : ObjectPartial<T> | NonObjectPortion<T>;

export type SchemaMerge<T, U> = [MergedObjectPortion<T, U>] extends [never]
  ? NonObjectPortion<T> | NonObjectPortion<U>
  : NonObjectPortion<T> extends never
    ? NonObjectPortion<U> extends never
      ? MergedObjectPortion<T, U>
      : MergedObjectPortion<T, U> | NonObjectPortion<U>
    : MergedObjectPortion<T, U> | NonObjectPortion<T> | NonObjectPortion<U>;

type ObjectKeys<T> = ObjectPortion<T> extends never ? never : keyof ObjectPortion<T>;

export type SchemaKey<T> = ObjectKeys<T> extends never ? string : Extract<ObjectKeys<T>, string>;

/**
 * Maps common JavaScript constructors to their corresponding TypeScript types.
 *
 * This utility type converts constructor functions (String, Number, Date, etc.) into
 * their corresponding runtime types, enabling better type inference when creating
 * schemas programmatically.
 *
 * ### Type Mappings
 *
 * - `StringConstructor` → `string`
 * - `NumberConstructor` → `number`
 * - `BooleanConstructor` → `boolean`
 * - `DateConstructor` → `Date`
 * - `ArrayConstructor` → `any[]`
 * - `MapConstructor` → `Record<string, any>`
 * - `SetConstructor` → `Set<any>`
 * - `ObjectConstructor` → `Record<string, any>`
 * - Custom classes → `InstanceType<C>`
 *
 * ### Usage
 *
 * ```typescript
 * type StringType = CtorToType<StringConstructor>;  // string
 * type DateType = CtorToType<DateConstructor>;      // Date
 * type CustomType = CtorToType<typeof MyClass>;     // MyClass
 * ```
 *
 * @typeParam C - The constructor function to map
 *
 * @public
 */
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

/**
 * Converts a union type to an intersection type.
 *
 * This advanced TypeScript utility transforms a union of types (A | B | C) into
 * an intersection of types (A & B & C), which is useful for schema composition
 * and merging operations.
 *
 * ### Usage
 *
 * ```typescript
 * type Union = { a: string } | { b: number };
 * type Intersection = UnionToIntersection<Union>;
 * // Result: { a: string } & { b: number }
 * ```
 *
 * @typeParam U - The union type to convert
 *
 * @public
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
