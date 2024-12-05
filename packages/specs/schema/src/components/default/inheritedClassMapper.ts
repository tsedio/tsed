import {classOf, deepMerge} from "@tsed/core";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {getInheritedStores} from "../../utils/getInheritedStores.js";

function alterMerge(_: string, obj: any) {
  if (obj?.type && obj?.$ref) {
    const {$ref, ...schema} = obj;

    obj = {
      allOf: [
        {
          $ref
        },
        schema
      ]
    };
  }

  return obj;
}

/**
 * @ignore
 */
export function inheritedClassMapper(obj: any, {target, ...options}: JsonSchemaOptions) {
  const stores = Array.from(getInheritedStores(target).entries()).filter(([model]) => classOf(model) !== classOf(target));

  if (stores.length) {
    const schema = stores.reduce((obj, [, store]) => {
      return deepMerge(obj, execMapper("schema", [store.schema], options), {alter: alterMerge});
    }, {});

    return deepMerge(schema, obj, {alter: alterMerge});
  }

  return obj;
}

registerJsonSchemaMapper("inheritedClass", inheritedClassMapper);
