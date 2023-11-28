import {mapGenericsOptions} from "../../utils/generics";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";

/**
 * Serialize class which inherit from Map like JsonMap, JsonOperation, JsonParameter.
 * @param input
 * @param ignore
 * @param options
 * @ignore
 */
export function mapMapper(input: Map<string, any>, {ignore = [], ...options}: JsonSchemaOptions = {}): any {
  options = mapGenericsOptions(options);

  return Array.from(input.entries()).reduce((obj: any, [key, value]) => {
    if (ignore.includes(key)) {
      return obj;
    }

    obj[key] = execMapper("item", [value], options);
    return obj;
  }, {});
}

registerJsonSchemaMapper("map", mapMapper);
