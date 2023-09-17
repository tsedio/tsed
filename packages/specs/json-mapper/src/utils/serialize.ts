import "../components/DateMapper";
import "../components/PrimitiveMapper";
import "../components/SymbolMapper";

import {JsonSerializer} from "../domain/JsonSerializer";
import {JsonSerializerOptions} from "../domain/JsonSerializerOptions";

const serializer = new JsonSerializer();

export function serialize(input: any, options?: JsonSerializerOptions) {
  return serializer.map(input, options);
}
