import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {JsonSerializer} from "../domain/JsonSerializer.js";
import {JsonSerializerOptions} from "../domain/JsonSerializerOptions.js";

const serializer = new JsonSerializer();

export function serialize(input: any, options?: JsonSerializerOptions) {
  return serializer.map(input, options);
}
