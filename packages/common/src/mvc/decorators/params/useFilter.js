"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamRegistry_1 = require("../../registries/ParamRegistry");
function UseFilter(token, options = {}) {
    return (target, propertyKey, index) => {
        ParamRegistry_1.ParamRegistry.useFilter(token, Object.assign({ target,
            propertyKey,
            index }, options));
    };
}
exports.UseFilter = UseFilter;
//# sourceMappingURL=useFilter.js.map