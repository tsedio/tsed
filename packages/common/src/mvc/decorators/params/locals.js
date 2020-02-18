"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamTypes_1 = require("../../models/ParamTypes");
const useFilter_1 = require("./useFilter");
const mapParamsOptions_1 = require("../utils/mapParamsOptions");
function Locals(...args) {
    const { expression, useType, useConverter = false, useValidation = false } = mapParamsOptions_1.mapParamsOptions(args);
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.LOCALS, {
        expression,
        useType,
        useConverter,
        useValidation
    });
}
exports.Locals = Locals;
//# sourceMappingURL=locals.js.map