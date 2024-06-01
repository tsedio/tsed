import "../components/DateMapper";
import "../components/PrimitiveMapper";
import "../components/SymbolMapper";

import {JsonSerializer} from "../domain/JsonSerializer.js";
import {JsonSerializerOptions} from "../domain/JsonSerializerOptions.js";

const serializer = new JsonSerializer();

export function serialize(input: any, options?: JsonSerializerOptions) {
  return serializer.map(input, options);
}
