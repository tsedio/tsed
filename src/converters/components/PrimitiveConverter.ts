/**
 * @module converters
 */ /** */

import {Converter} from "../decorators/converter";
import {BadRequest} from "ts-httpexceptions";
import {IConverter} from "../interfaces/index";

/**
 * @private
 */
@Converter(String, Number, Boolean)
export class PrimitiveConverter implements IConverter {

    deserialize(data: string, target: any): String | Number | Boolean {

        switch (target) {
            case String:
                return "" + data;

            case Number:
                const n = +data;

                if (isNaN(n)) {
                    throw new BadRequest("Cast error. Expression value is not a number.");
                }

                return n;

            case Boolean:

                if (data === "true") return true;
                if (data === "false") return false;

                return !!data;

        }

    }

    serialize(object: String | Number | Boolean): any {
        return object;
    }
}