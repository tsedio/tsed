"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useFilter_1 = require("./useFilter");
const ParamTypes_1 = require("../../models/ParamTypes");
/**
 *
 * @returns {Function}
 * @decorator
 */
function EndpointInfo() {
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.ENDPOINT_INFO, {
        useConverter: false,
        useValidation: false
    });
}
exports.EndpointInfo = EndpointInfo;
//# sourceMappingURL=endpointInfo.js.map