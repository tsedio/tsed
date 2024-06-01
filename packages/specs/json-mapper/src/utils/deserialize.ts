import "../components/DateMapper";
import "../components/PrimitiveMapper";
import "../components/SymbolMapper";

import {JsonDeserializer} from "../domain/JsonDeserializer.js";
import {JsonDeserializerOptions} from "../domain/JsonDeserializerOptions.js";

const deserializer = new JsonDeserializer();

export function deserialize<Model = any>(input: any, options?: JsonDeserializerOptions): Model {
  return deserializer.map<Model>(input, options);
}
