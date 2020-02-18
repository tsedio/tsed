"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const converter_1 = require("../decorators/converter");
/**
 * Converter component for the `Map` Type.
 * @converters
 * @component
 */
let MapConverter = class MapConverter {
    /**
     *
     * @param data
     * @param target
     * @param baseType
     * @param deserializer
     * @returns {Map<string, T>}
     */
    deserialize(data, target, baseType, deserializer) {
        const obj = new Map();
        Object.keys(data).forEach(key => {
            obj.set(key, deserializer(data[key], baseType));
        });
        return obj;
    }
    /**
     *
     * @param data
     * @param serializer
     */
    serialize(data, serializer) {
        const obj = {};
        data.forEach((value, key) => (obj[key] = serializer(value)));
        return obj;
    }
};
MapConverter = tslib_1.__decorate([
    converter_1.Converter(Map)
], MapConverter);
exports.MapConverter = MapConverter;
//# sourceMappingURL=MapConverter.js.map