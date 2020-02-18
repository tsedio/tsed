"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const converter_1 = require("../decorators/converter");
/**
 * Converter component for the `String`, `Number` and `Boolean` Types.
 * @converters
 * @component
 */
let PrimitiveConverter = class PrimitiveConverter {
    deserialize(data, target) {
        switch (target) {
            case String:
                return "" + data;
            case Number:
                if ([null, "null"].includes(data))
                    return null;
                const n = +data;
                if (isNaN(n)) {
                    throw new ts_httpexceptions_1.BadRequest("Cast error. Expression value is not a number.");
                }
                return n;
            case Boolean:
                if (["true", "1", true].includes(data))
                    return true;
                if (["false", "0", false].includes(data))
                    return false;
                if ([null, "null"].includes(data))
                    return null;
                if (data === undefined)
                    return undefined;
                return !!data;
        }
    }
    serialize(object) {
        return object;
    }
};
PrimitiveConverter = tslib_1.__decorate([
    converter_1.Converter(String, Number, Boolean)
], PrimitiveConverter);
exports.PrimitiveConverter = PrimitiveConverter;
//# sourceMappingURL=PrimitiveConverter.js.map