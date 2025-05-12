import {JsonEntityStore} from "../../domain/JsonEntityStore.js";

export interface ArrayOfChainedDecorators {
  (...args: any): any;

  /**
   * An array instance is valid against `minItems` if its size is greater than, or equal to, the value of this keyword.
   *
   * ::: warning
   * The value `minItems` MUST be a non-negative integer.
   * :::
   *
   * ::: tip
   * Omitting this keyword has the same behavior as a value of 0.
   * :::
   * @deprecated Since 2025-05-12. Use MinItems decorator instead.
   */
  MinItems(minItems: number): this;

  /**
   * The value `maxItems` MUST be a non-negative integer.
   *
   * An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.
   *
   * :: warning
   * The value `maxItems` MUST be a non-negative integer.
   * :::
   * @deprecated Since 2025-05-12. Use MaxItems decorator instead.
   */
  MaxItems(maxItems: number): this;

  /**
   * Set the type of the item collection. The possible value is String, Boolean, Number, Date, Object, Class, etc...
   *
   * The array instance will be valid against "contains" if at least one of its elements is valid against the given schema.
   * @deprecated Since 2025-05-12. Use Contains decorator instead.
   */
  Contains(): this;

  /**
   * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
   * @deprecated Since 2025-05-12. Use UniqueItems decorator instead.
   */
  UniqueItems(uniqueItems?: boolean): this;
}

export interface MapOfChainedDecorators {
  (...args: any): any;

  /**
   * An object instance is valid against `minProperties` if its number of properties is less than, or equal to, the value of this keyword.
   *
   * ::: warning
   * The value of this keyword MUST be a non-negative integer.
   * :::
   * @deprecated Since 2025-05-12. Use MinProperties decorator instead.
   */
  MinProperties(minProperties: number): this;

  /**
   * An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.
   *
   * ::: warning
   * The value of this keyword MUST be a non-negative integer.
   * :::
   * @deprecated Since 2025-05-12. Use MaxProperties decorator instead.
   */
  MaxProperties(maxProperties: number): this;
}

export interface CollectionOfChainedDecorators extends MapOfChainedDecorators, ArrayOfChainedDecorators {}

/**
 * Set the type of the item collection. The possible value is String, Boolean, Number, Date, Object, Class, etc...
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(String).MinLength(0).MaxLength(0)
 *    property: string[];
 * }
 * ```
 * ::: warning
 * You mustn't use the `type Type = string | number` as parameters Type.
 *
 * This example doesn't work:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @CollectionOf(Type)
 *    property: Type[];
 * }
 * ```
 * :::
 *
 * @param {Type<any>} type
 * @param collectionType
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @collections
 */
export function CollectionOf(type: any, collectionType?: any): CollectionOfChainedDecorators {
  if (!type) {
    throw new Error(
      "A type is required on `@CollectionOf(type)` decorator. Please give a type or wrap it inside an arrow function if you have a circular reference."
    );
  }

  const schema: any = {};
  let contains: boolean = false;

  const decorator = (...args: any) => {
    const store = JsonEntityStore.from(...args);

    if (collectionType) {
      store.collectionType = collectionType;
      store.schema.type(collectionType);
    }

    store.type = type;
    store.itemSchema.type(type);

    store.schema.assign(schema);

    if (store.isArray && contains) {
      store.schema.set("contains", store.schema.get("items"));
      store.schema.delete("items");
    }
  };
  /**
   * @deprecated Since 2025-05-12. Use MinItems decorator instead.
   */
  decorator.MinItems = (minItems: number) => {
    schema.minItems = minItems;

    return decorator;
  };
  /**
   * @deprecated Since 2025-05-12. Use MaxItems decorator instead.
   */
  decorator.MaxItems = (maxItems: number) => {
    schema.maxItems = maxItems;

    return decorator;
  };
  /**
   * @deprecated Since 2025-05-12. Use MinProperties decorator instead.
   */
  decorator.MinProperties = (minProperties: number) => {
    schema.minProperties = minProperties;

    return decorator;
  };
  /**
   * @deprecated Since 2025-05-12. Use MaxProperties decorator instead.
   */
  decorator.MaxProperties = (maxProperties: number) => {
    schema.maxProperties = maxProperties;

    return decorator;
  };

  /**
   * @deprecated Since 2025-05-12. Use Contains decorator instead.
   */
  decorator.Contains = () => {
    contains = true;

    return decorator;
  };

  /**
   * @deprecated Since 2025-05-12. Use UniqueItems decorator instead.
   */
  decorator.UniqueItems = (uniqueItems = true) => {
    schema.uniqueItems = uniqueItems;

    return decorator;
  };

  return decorator;
}

/**
 * Alias of @@GenericOf@@ decorator.
 * @param type
 * @decorator
 */
export function ArrayOf(type: any): ArrayOfChainedDecorators {
  return CollectionOf(type, Array);
}

/**
 * Alias of @@GenericOf@@ decorator.
 * @param type
 * @decorator
 */
export function MapOf(type: any): MapOfChainedDecorators {
  return CollectionOf(type, Map);
}
