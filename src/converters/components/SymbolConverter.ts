/**
 * @module converters
 */ /** */

import {Converter} from "../decorators/converter";
import {IConverter} from "../interfaces/index";
/**
 * @private
 */
@Converter(Symbol)
export class SymbolConverter implements IConverter {

    deserialize(data: string, target: any): symbol {
        return Symbol(data);
    }

    serialize(object: Symbol): any {
        return object.toString().replace("Symbol(", "").replace(")", "");
    }
}