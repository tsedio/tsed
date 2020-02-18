"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamTypes_1 = require("../../models/ParamTypes");
const useFilter_1 = require("./useFilter");
/**
 * Response service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
function Response() {
    return Res();
}
exports.Response = Response;
/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
function Res() {
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.RESPONSE);
}
exports.Res = Res;
//# sourceMappingURL=response.js.map