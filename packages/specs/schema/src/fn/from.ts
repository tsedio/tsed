import {isClass, Type} from "@tsed/core";

import {JsonSchema} from "../domain/JsonSchema.js";
import {getJsonEntityStore} from "../utils/getJsonEntityStore.js";

/**
 * Create a new model from the given type.
 *
 * ```typescript
 * from(String)
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function from(type: Type<any> = Object) {
  if (isClass(type)) {
    const {schema} = getJsonEntityStore(type);

    schema.properties = function properties(obj: {[key: string]: JsonSchema}) {
      Object.entries(obj).forEach(([propertyKey, propSchema]) => {
        getJsonEntityStore(type.prototype, propertyKey).schema.assign(propSchema);
      });

      return this;
    };

    return schema;
  }

  return JsonSchema.from({type});
}
