import {cleanObject, Type} from "@tsed/core";

/**
 * Manages discriminator mappings for polymorphic type resolution.
 *
 * A discriminator enables polymorphism in schemas by using a specific property
 * value to determine which subtype schema to apply. This is essential for
 * inheritance hierarchies and union types in OpenAPI specifications.
 *
 * ### Concept
 *
 * When a base class has multiple derived classes, the discriminator property
 * (e.g., "type", "kind") indicates which concrete class an object represents.
 *
 * ### Usage
 *
 * ```typescript
 * // Base class
 * @DiscriminatorKey("type")
 * abstract class Animal {
 *   type: string;
 * }
 *
 * // Derived classes
 * @DiscriminatorValue("dog")
 * class Dog extends Animal {
 *   breed: string;
 * }
 *
 * @DiscriminatorValue("cat")
 * class Cat extends Animal {
 *   indoor: boolean;
 * }
 * ```
 *
 * ### OpenAPI Mapping
 *
 * Generates OpenAPI discriminator objects:
 * ```json
 * {
 *   "discriminator": {
 *     "propertyName": "type",
 *     "mapping": {
 *       "dog": "#/components/schemas/Dog",
 *       "cat": "#/components/schemas/Cat"
 *     }
 *   }
 * }
 * ```
 *
 * ### Key Features
 *
 * - **Type Mapping**: Maps discriminator values to TypeScript classes
 * - **Bidirectional Lookup**: Find type by value or values by type
 * - **Default Values**: Get the default discriminator value for a type
 * - **Children Discovery**: List all derived types
 *
 * @public
 */
export class Discriminator {
  propertyName!: string;
  base!: Type<any>;
  values: Map<string, Type> = new Map();
  types: Map<Type, string[]> = new Map();

  constructor({
    base,
    propertyName,
    types,
    values
  }: Partial<{base: Type<any>; propertyName: string; values: Map<string, Type<any>>; types: Map<Type, string[]>}> = {}) {
    Object.assign(
      this,
      cleanObject({
        base,
        propertyName,
        types: types ? new Map(types) : undefined,
        values: values ? new Map(values) : undefined
      })
    );
  }

  add(type: Type<string>, values: string[]) {
    values.forEach((value) => {
      this.values.set(value, type);
    });

    this.types.set(type, values);

    return this;
  }

  getType(discriminatorValue: string): Type<any> {
    return this.values.get(discriminatorValue) || this.base;
  }

  getValues(type: Type) {
    return this.types.get(type);
  }

  getDefaultValue(type: Type<any>) {
    const values = this.types.get(type);
    return values ? values[0] : undefined;
  }

  children() {
    return [...new Set([...this.types.keys()])];
  }
}
