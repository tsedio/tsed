"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamTypes_1 = require("../../models/ParamTypes");
const useFilter_1 = require("./useFilter");
/**
 *
 * @returns {Function}
 * @decorators
 */
function Err() {
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.ERR, {
        useValidation: false,
        useConverter: false
    });
}
exports.Err = Err;
//# sourceMappingURL=error.js.map