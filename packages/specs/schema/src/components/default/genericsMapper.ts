import {isClass, isPrimitiveClass} from "@tsed/core";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {GenericsContext, popGenerics} from "../../utils/generics.js";
import {getJsonType} from "../../utils/getJsonType.js";

/**
 * @ignore
 */
export function genericsMapper(obj: any, options: GenericsContext) {
  const {generics} = options;

  if (generics && obj.$ref) {
    if (generics.has(obj.$ref)) {
      let type = generics.get(obj.$ref);

      if (isPrimitiveClass(type)) {
        return {
          type: getJsonType(type)
        };
      }

      if (type === Date) {
        return {
          type: "string",
          format: "date-time"
        };
      }

      if (type.toJSON) {
        return type.toJSON({
          ...options,
          generics: undefined
        });
      }

      if (type === Object) {
        return {
          type: "object"
        };
      }

      if (isClass(type)) {
        const model = {
          class: type
        };

        if (options.nestedGenerics.length === 0) {
          return execMapper("class", [model as any], {
            ...options,
            generics: undefined
          });
        }

        const store = JsonEntityStore.from(model.class);

        return execMapper("schema", [store.schema], {
          ...options,
          ...popGenerics(options),
          root: false
        });
      }
    }
  }

  return obj;
}

registerJsonSchemaMapper("generics", genericsMapper);
