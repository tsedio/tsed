import {classOf, deepMerge} from "@tsed/core";

import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {getInheritedStores} from "../../utils/getInheritedStores.js";

/**
 * @ignore
 */
export function inheritedClassMapper(obj: any, {target, ...options}: JsonSchemaOptions) {
  const stores = Array.from(getInheritedStores(target).entries()).filter(([model]) => classOf(model) !== classOf(target));

  if (stores.length) {
    const schema = stores.reduce((obj, [, store]) => {
      return deepMerge(obj, execMapper("schema", [store.schema], options));
    }, {});

    obj = deepMerge(schema, obj);
  }

  return obj;
}

registerJsonSchemaMapper("inheritedClass", inheritedClassMapper);
