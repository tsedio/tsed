import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";

/**
 * Serialize class which inherit from Map like JsonMap, JsonOperation, JsonParameter.
 * @param input
 * @param ignore
 * @param options
 * @ignore
 */
export function mapMapper(input: Map<string, any>, {ignore = [], ...options}: JsonSchemaOptions = {}): any {
  return Array.from(input.entries()).reduce((obj: any, [key, value]) => {
    if (ignore.includes(key)) {
      return obj;
    }

    obj[key] = execMapper("item", [value], options);
    return obj;
  }, {});
}

defineSchemaMapper({type: "map", transform: mapMapper});
