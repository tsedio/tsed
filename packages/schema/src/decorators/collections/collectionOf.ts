import {JsonEntityStore} from "../../domain/JsonEntityStore";

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
 * You musn't use the `type Type = string | number` as parameters Type.
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
 * @returns {Function}
 * @decorator
 * @schema
 */
export function CollectionOf(type: any, collectionType?: any) {
  const schema: any = {};
  let contains: boolean = false;

  const decorator = (...args: any) => {
    const store = JsonEntityStore.from(...args);
    const itemSchema = store.itemSchema.toJSON();

    if (collectionType) {
      store.collectionType = collectionType;
      store.schema.type(collectionType);
    }

    store.type = type;
    store.itemSchema.assign({...itemSchema, type});
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
export function ArrayOf(type: any) {
  return CollectionOf(type, Array);
}

/**
 * Alias of @@GenericOf@@ decorator.
 * @param type
 * @decorator
 */
export function MapOf(type: any) {
  return CollectionOf(type, Map);
}
