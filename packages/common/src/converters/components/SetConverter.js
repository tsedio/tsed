"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const converter_1 = require("../decorators/converter");
/**
 * Converter component for the `Set` Type.
 * @converters
 * @component
 */
let SetConverter = class SetConverter {
    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @param deserializer
     * @returns {Map<string, T>}
     */
    deserialize(data, target, baseType, deserializer) {
        const obj = new Set();
        Object.keys(data).forEach(key => {
            obj.add(deserializer(data[key], baseType));
        });
        return obj;
    }
    /**
     *
     * @param data
     * @param serializer
     */
    serialize(data, serializer) {
        const array = [];
        data.forEach(value => array.push(serializer(value)));
        return array;
    }
};
SetConverter = tslib_1.__decorate([
    converter_1.Converter(Set)
], SetConverter);
exports.SetConverter = SetConverter;
//# sourceMappingURL=SetConverter.js.map