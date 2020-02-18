"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
let ValidationService = class ValidationService {
    validate(obj, targetType, baseType) {
        return true;
    }
};
ValidationService = tslib_1.__decorate([
    di_1.Service()
], ValidationService);
exports.ValidationService = ValidationService;
//# sourceMappingURL=ValidationService.js.map