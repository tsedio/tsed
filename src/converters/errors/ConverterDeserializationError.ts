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
export class ConverterDeserializationError extends InternalServerError {

    name: string = "CONVERTER_DESERIALIZATION_ERROR";
    stack: any;

    constructor(target: Type<any>, obj: any, err: Error) {
        super(ConverterDeserializationError.buildMessage(target, obj, err));
        this.stack = err.stack;
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any>, obj: any, err: Error) {
        return `Conversion failed for class "${nameOf(target)}" with object => ${JSON.stringify(obj)}.\n${err.message}`.trim();
    }
}