/**
 * @module converters
 */ /** */

import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";
/**
 * @private
 */
export class ConverterSerializationError extends InternalServerError {

    name = "CONVERTER_SERIALIZATION_ERROR";
    stack;

    constructor(target: Type<any>, err: Error) {
        super(ConverterSerializationError.buildMessage(target, err));
        this.stack = err.stack;
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any>, err: Error) {
        return `Convertion failed for class "${nameOf(target)}".`.trim();
    }
}