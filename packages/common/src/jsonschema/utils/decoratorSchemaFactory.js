"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const JsonSchemesRegistry_1 = require("../registries/JsonSchemesRegistry");
const PropertyRegistry_1 = require("../registries/PropertyRegistry");
/**
 *
 * @param {(schema: JsonSchema, parameters: DecoratorParameters) => void} fn
 * @returns {(...parameters: any[]) => any}
 */
function decoratorSchemaFactory(fn) {
    return (...parameters) => {
        let schema;
        switch (core_1.getDecoratorType(parameters)) {
            case "property":
                schema = PropertyRegistry_1.PropertyRegistry.get(parameters[0], parameters[1]).schema;
                break;
            case "class":
                schema = JsonSchemesRegistry_1.JsonSchemesRegistry.createIfNotExists(parameters[0]);
                break;
        }
        const result = fn(schema, parameters);
        if (typeof result === "function") {
            result(...parameters);
        }
        return parameters[2];
    };
}
exports.decoratorSchemaFactory = decoratorSchemaFactory;
//# sourceMappingURL=decoratorSchemaFactory.js.map