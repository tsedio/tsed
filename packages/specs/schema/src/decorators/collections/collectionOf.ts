import {Type} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";

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
   */
  MaxItems(maxItems: number): this;

  /**
   * Set the type of the item collection. The possible value is String, Boolean, Number, Date, Object, Class, etc...
   *
   * The array instance will be valid against "contains" if at least one of its elements is valid against the given schema.
   */
  Contains(): this;

  /**
   * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
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
   */
  MinProperties(minProperties: number): this;

  /**
   * An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.
   *
   * ::: warning
   * The value of this keyword MUST be a non-negative integer.
   * :::
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
  const schema: any = {};
  let contains: boolean = false;

  const decorator = (...args: any) => {
    const store = JsonEntityStore.from(...args);
    // const itemSchema = store.itemSchema.toJSON();

    if (collectionType) {
      store.collectionType = collectionType;
      store.schema.type(collectionType);
    }

    store.type = type;
    // console.log(type);
    store.itemSchema.type(type);
    // console.log(store.itemSchema.getComputedType(), schema);
    // store.itemSchema.assign({...itemSchema, type});
    store.schema.assign(schema);

    if (store.isArray && contains) {
      store.schema.set("contains", store.schema.get("items"));
      store.schema.delete("items");
    }
  };

  decorator.MinItems = (minItems: number) => {
    schema.minItems = minItems;

    return decorator;
  };

  decorator.MaxItems = (maxItems: number) => {
    schema.maxItems = maxItems;

    return decorator;
  };
  decorator.MinProperties = (minProperties: number) => {
    schema.minProperties = minProperties;

    return decorator;
  };

  decorator.MaxProperties = (maxProperties: number) => {
    schema.maxProperties = maxProperties;

    return decorator;
  };

  decorator.Contains = () => {
    contains = true;

    return decorator;
  };

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
