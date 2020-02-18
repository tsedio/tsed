"use strict";
/**
 * @module common/converters
 */
/** */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const index_1 = require("../constants/index");
const ConverterRegistries_1 = require("../registries/ConverterRegistries");
/**
 * `@Converter(...targetTypes)` let you to define some converters for a certain type/Class.
 * It useful for a generic conversion.
 *
 * @param classes
 * @returns {(customConverter?:any)=>undefined}
 * @decorator
 */
function Converter(...classes) {
    return (target) => {
        /* istanbul ignore next */
        if (classes.length === 0) {
            throw new Error("Converter decorator need at least one type like String, Date, Class, etc...");
        }
        ConverterRegistries_1.registerConverter({ provide: target, type: "converter" });
        classes.forEach(clazz => core_1.Metadata.set(index_1.CONVERTER, target, clazz));
    };
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map