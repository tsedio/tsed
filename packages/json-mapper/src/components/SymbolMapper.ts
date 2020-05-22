import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";
/**
 * Converter component for the `Symbol` Type.
 * @converters
 * @jsonmapper
 * @component
 */
@JsonMapper(Symbol)
export class SymbolMapper implements JsonMapperMethods {
  deserialize(data: string): symbol {
    return Symbol.for(data);
  }

  serialize(object: Symbol): any {
    return object
      .toString()
      .replace("Symbol(", "")
      .replace(")", "");
  }
}
