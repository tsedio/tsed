"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamTypes_1 = require("../../models/ParamTypes");
const useFilter_1 = require("./useFilter");
const mapParamsOptions_1 = require("../utils/mapParamsOptions");
function Request(...args) {
    // @ts-ignore
    return Req(...args);
}
exports.Request = Request;
function Req(...args) {
    const { expression, useType, useConverter = false, useValidation = false } = mapParamsOptions_1.mapParamsOptions(args);
    return useFilter_1.UseFilter(ParamTypes_1.ParamTypes.REQUEST, {
        expression,
        useType,
        useConverter,
        useValidation
    });
}
exports.Req = Req;
//# sourceMappingURL=request.js.map