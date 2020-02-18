"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const converter_1 = require("../decorators/converter");
/**
 * Converter component for the `Date` Type.
 * @converters
 * @component
 */
let DateConverter = class DateConverter {
    deserialize(data) {
        return new Date(data);
    }
    serialize(object) {
        return object.toISOString();
    }
};
DateConverter = tslib_1.__decorate([
    converter_1.Converter(Date)
], DateConverter);
exports.DateConverter = DateConverter;
//# sourceMappingURL=DateConverter.js.map