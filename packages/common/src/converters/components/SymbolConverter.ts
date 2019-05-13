import {Converter} from "../decorators/converter";
import {IConverter} from "../interfaces/index";

/**
 * Converter component for the `Symbol` Type.
 * @converters
 * @component
 */
@Converter(Symbol)
export class SymbolConverter implements IConverter {
  deserialize(data: string, target: any): symbol {
    return Symbol(data);
  }

  serialize(object: Symbol): any {
    return object
      .toString()
      .replace("Symbol(", "")
      .replace(")", "");
  }
}
