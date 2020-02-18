"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * @private
 */
class ConverterDeserializationError extends ts_httpexceptions_1.InternalServerError {
    constructor(target, obj, err) {
        super(ConverterDeserializationError.buildMessage(target, obj, err));
        this.name = "CONVERTER_DESERIALIZATION_ERROR";
        this.stack = err.stack;
    }
    /**
     *
     * @returns {string}
     */
    static buildMessage(target, obj, err) {
        return `Conversion failed for class "${core_1.nameOf(target)}" with object => ${JSON.stringify(obj)}.\n${err.message}`.trim();
    }
}
exports.ConverterDeserializationError = ConverterDeserializationError;
//# sourceMappingURL=ConverterDeserializationError.js.map