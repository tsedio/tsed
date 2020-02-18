"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamTypes_1 = require("../../models/ParamTypes");
const useFilter_1 = require("./useFilter");
/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
function Next() {
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.NEXT_FN, {
        useConverter: false,
        useValidation: false
    });
}
exports.Next = Next;
//# sourceMappingURL=next.js.map