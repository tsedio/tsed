"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
/**
 *
 * @param symbol
 * @returns {Function}
 * @decorator
 */
function Inject(symbol) {
    return (target, propertyKey, descriptor) => {
        const bindingType = core_1.getDecoratorType([target, propertyKey, descriptor], true);
        switch (bindingType) {
            case "parameter":
            case "parameter.constructor":
                if (symbol) {
                    const paramTypes = core_1.Metadata.getParamTypes(target, propertyKey);
                    paramTypes[descriptor] = symbol;
                    core_1.Metadata.setParamTypes(target, propertyKey, paramTypes);
                }
                break;
            case "property":
                core_1.Store.from(target).merge("injectableProperties", {
                    [propertyKey]: {
                        bindingType,
                        propertyKey,
                        useType: symbol || core_1.Metadata.getType(target, propertyKey)
                    }
                });
                break;
            case "method":
                core_1.Store.from(target).merge("injectableProperties", {
                    [propertyKey]: {
                        bindingType,
                        propertyKey
                    }
                });
                return descriptor;
            default:
                throw new core_1.UnsupportedDecoratorType(Inject, [target, propertyKey, descriptor]);
        }
    };
}
exports.Inject = Inject;
//# sourceMappingURL=inject.js.map