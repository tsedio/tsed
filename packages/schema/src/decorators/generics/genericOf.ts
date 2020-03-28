import {Type} from "@tsed/core";
import {JsonSchemaStore} from "../../domain/JsonSchemaStore";

/**
 * Set the types of a Generic class.
 *
 * ## Example
 *
 * ```typescript
 * class Product {
 *   @Property()
 *   label: string;
 * }
 *
 * @Generics("T")
 * class Paginated<T> {
 *   @CollectionOf("T")
 *   data: T[];
 *
 *   @Property()
 *   totalCount: number;
 * }
 *
 * class Payload {
 *    @GenericOf(Product)
 *    products: Paginated<Product>;
 * }
 * ```
 *
 * ## Example with nested generics
 *
 * ```typescript
 * class Product {
 *   @Property()
 *   label: string;
 * }
 *
 * @Generics("T")
 * class Paginated<T> {
 *   @CollectionOf("T")
 *   data: T[];
 *
 *   @Property()
 *   totalCount: number;
 * }
 *
 * @Generics("D")
 * class Submission<D> {
 *   @Property()
 *   _id: string;
 *
 *   @Property("D")
 *   data: D;
 * }
 *
 * class Payload {
 *    @GenericOf(Submissions).Nested(Product)
 *    submissions: Paginated<Submission<Product>>;
 * }
 * ```
 *
 * @param {Type<any>[]} generics
 * @returns {Function}
 * @decorator
 * @schema
 */
export function GenericOf(...generics: Type<any>[]) {
  const nestedGenerics: Type<any>[][] = [generics];

  const decorator = (...args: any) => {
    const store = JsonSchemaStore.from(...args);
    store.nestedGenerics = nestedGenerics;
  };

  decorator.Nested = (...generics: any) => {
    nestedGenerics.push(generics);

    return decorator;
  };

  return decorator;
}
