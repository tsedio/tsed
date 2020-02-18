"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamTypes_1 = require("../../models/ParamTypes");
const useFilter_1 = require("./useFilter");
/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
function ResponseData() {
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.RESPONSE_DATA);
}
exports.ResponseData = ResponseData;
//# sourceMappingURL=responseData.js.map