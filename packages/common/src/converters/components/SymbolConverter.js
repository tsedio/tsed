"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const converter_1 = require("../decorators/converter");
/**
 * Converter component for the `Symbol` Type.
 * @converters
 * @component
 */
let SymbolConverter = class SymbolConverter {
    deserialize(data, target) {
        return Symbol(data);
    }
    serialize(object) {
        return object
            .toString()
            .replace("Symbol(", "")
            .replace(")", "");
    }
};
SymbolConverter = tslib_1.__decorate([
    converter_1.Converter(Symbol)
], SymbolConverter);
exports.SymbolConverter = SymbolConverter;
//# sourceMappingURL=SymbolConverter.js.map