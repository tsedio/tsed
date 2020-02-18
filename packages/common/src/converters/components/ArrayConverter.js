"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const converter_1 = require("../decorators/converter");
/**
 * Converter component for the `Array` Type.
 * @converters
 * @component
 */
let ArrayConverter = class ArrayConverter {
    deserialize(data, target, baseType, deserializer) {
        return [].concat(data).map(item => deserializer(item, baseType));
    }
    serialize(data, serializer) {
        return [].concat(data).map(item => serializer(item));
    }
};
ArrayConverter = tslib_1.__decorate([
    converter_1.Converter(Array)
], ArrayConverter);
exports.ArrayConverter = ArrayConverter;
//# sourceMappingURL=ArrayConverter.js.map