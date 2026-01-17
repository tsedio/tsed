import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {JsonDeserializer} from "../domain/JsonDeserializer.js";
import {JsonDeserializerOptions} from "../domain/JsonDeserializerOptions.js";

const deserializer = new JsonDeserializer();

/**
 * Deserialize arbitrary data into the provided model type using the shared `JsonDeserializer`.
 *
 * ### Example
 *
 * ```ts
 * import {deserialize} from "@tsed/json-mapper";
 *
 * const model = deserialize<UserModel>(payload, {type: UserModel, useAlias: true});
 * ```
 */
export function deserialize<Model = any>(input: any, options?: JsonDeserializerOptions): Model {
  return deserializer.map<Model>(input, options);
}
