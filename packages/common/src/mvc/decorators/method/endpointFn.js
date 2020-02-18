"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const EndpointRegistry_1 = require("../../registries/EndpointRegistry");
/**
 *
 * @param fn
 * @decorator
 */
function EndpointFn(fn) {
    return (target, property, descriptor) => {
        if (core_1.getDecoratorType([target, property, descriptor]) === "method") {
            fn(EndpointRegistry_1.EndpointRegistry.get(target, property), [target, property, descriptor]);
            return descriptor;
        }
    };
}
exports.EndpointFn = EndpointFn;
//# sourceMappingURL=endpointFn.js.map