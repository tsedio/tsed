import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {JsonSerializer} from "../domain/JsonSerializer.js";
import {JsonSerializerOptions} from "../domain/JsonSerializerOptions.js";

const serializer = new JsonSerializer();

/**
 * Serialize any value using the shared `JsonSerializer` instance.
 * Respects schema metadata, hooks, aliases, and registered custom mappers.
 *
 * ### Example
 *
 * ```ts
 * import {serialize} from "@tsed/json-mapper";
 *
 * const payload = serialize(model, {type: UserModel, useAlias: true});
 * ```
 */
export function serialize(input: any, options?: JsonSerializerOptions) {
  return serializer.map(input, options);
}
