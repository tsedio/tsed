"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
function mapParamsOptions(args) {
    if (args.length === 1) {
        if (core_1.isPrimitive(args[0])) {
            return {
                expression: args[0]
            };
        }
        if (!core_1.isObject(args[0])) {
            return {
                useType: args[0]
            };
        }
        return args[0];
    }
    return {
        expression: args[0],
        useType: args[1]
    };
}
exports.mapParamsOptions = mapParamsOptions;
//# sourceMappingURL=mapParamsOptions.js.map