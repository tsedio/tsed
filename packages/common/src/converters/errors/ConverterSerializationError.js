"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_httpexceptions_1 = require("ts-httpexceptions");
const core_1 = require("@tsed/core");
/**
 * @private
 */
class ConverterSerializationError extends ts_httpexceptions_1.InternalServerError {
    constructor(target, err) {
        super(ConverterSerializationError.buildMessage(target, err));
        this.name = "CONVERTER_SERIALIZATION_ERROR";
        this.stack = err.stack;
    }
    /**
     *
     * @returns {string}
     */
    static buildMessage(target, err) {
        return `Conversion failed for "${core_1.nameOf(target)}". ${err.message}`.trim();
    }
}
exports.ConverterSerializationError = ConverterSerializationError;
//# sourceMappingURL=ConverterSerializationError.js.map