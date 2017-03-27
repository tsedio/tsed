/**
 * @module converters
 */
/** */
import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";

/**
 * @private
 */
export class ConverterDeserializationError extends InternalServerError {

    name = "CONVERTER_DESERIALIZATION_ERROR";
    stack;

    constructor(target: Type<any>, obj: any, err: Error) {
        super(ConverterDeserializationError.buildMessage(target, obj, err));
        this.stack = err.stack;
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any>, obj: any, err: Error) {
        return `Convertion failed for class "${nameOf(target)}" with object => ${JSON.stringify(obj)}.\n${err.message}`.trim();
    }
}