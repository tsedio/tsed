import {JsonMapper} from "../decorators/jsonMapper.js";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";

/**
 * Mapper for the `Symbol` type.
 *
 * @jsonmapper
 * @component
 */
@JsonMapper(Symbol)
export class SymbolMapper implements JsonMapperMethods {
  deserialize(data: string): symbol {
    return Symbol.for(data);
  }

  serialize(object: Symbol): any {
    return object.toString().replace("Symbol(", "").replace(")", "");
  }
}
