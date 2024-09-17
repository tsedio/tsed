import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {JsonDeserializer} from "../domain/JsonDeserializer.js";
import {JsonDeserializerOptions} from "../domain/JsonDeserializerOptions.js";

const deserializer = new JsonDeserializer();

export function deserialize<Model = any>(input: any, options?: JsonDeserializerOptions): Model {
  return deserializer.map<Model>(input, options);
}
