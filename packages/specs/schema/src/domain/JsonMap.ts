import {isFunction} from "@tsed/core";

import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {JsonSchemaOptions} from "./JsonSchemaOptions.js";

/**
 * Base class for JSON document representations using a Map structure.
 *
 * JsonMap provides a Map-based foundation for storing and manipulating JSON-compatible
 * data structures. It extends the native Map with additional features for assignment,
 * serialization, and mapper integration.
 *
 * This class serves as the base for many Ts.ED schema classes including JsonOperation,
 * JsonParameter, JsonResponse, and JsonRequestBody.
 *
 * ### Usage
 *
 * ```typescript
 * class MyJsonDoc extends JsonMap<{name: string; value: number}> {
 *   // Custom methods
 * }
 *
 * const doc = new MyJsonDoc({name: "test", value: 42});
 * const json = doc.toJSON();
 * ```
 *
 * ### Key Features
 *
 * - **Map Interface**: Full Map API support for key-value operations
 * - **Fluent Assignment**: Assign multiple properties via object
 * - **Serialization**: Convert to plain JSON via mapper system
 * - **Type Safety**: Generic type parameter for stored values
 *
 * @typeParam T - The shape of the object this map represents
 *
 * @public
 */
export class JsonMap<T> extends Map<string, any> {
  [key: string]: any;

  $kind: string = "map";
  readonly $isJsonDocument = true;

  constructor(obj: Partial<T> = {}) {
    super();

    this.assign(obj);
  }

  assign(obj: Partial<T> & any = {}) {
    Object.entries(obj).forEach(([key, value]) => {
      if (isFunction(this[key])) {
        this[key](value);
      } else {
        this.set(key, value as T);
      }
    });

    return this;
  }

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("map", [this], options);
  }
}
