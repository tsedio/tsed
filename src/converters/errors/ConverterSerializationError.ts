/**
 * @module common/converters
 */
/** */

import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";

/**
 * @private
 */
export class ConverterSerializationError extends InternalServerError {

    name: string = "CONVERTER_SERIALIZATION_ERROR";
    stack: any;

    constructor(target: Type<any>, err: Error) {
        super(ConverterSerializationError.buildMessage(target, err));
        this.stack = err.stack;
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any>, err: Error) {
        return `Conversion failed for "${nameOf(target)}". ${err.message}`.trim();
    }
}