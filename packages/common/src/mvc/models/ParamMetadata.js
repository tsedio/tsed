"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
class ParamMetadata extends core_1.Storable {
    constructor(options) {
        super(options.target, options.propertyKey, options.index);
        /**
         *
         * @type {boolean}
         */
        this.useValidation = false;
        /**
         *
         * @type {boolean}
         */
        this.useConverter = false;
        const { expression, paramType, useValidation, useConverter, service } = options;
        this.expression = expression || this.expression;
        this.paramType = paramType || this.paramType;
        this.useValidation = Boolean(useValidation);
        this.useConverter = Boolean(useConverter);
        this.service = service || this.service;
    }
}
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], ParamMetadata.prototype, "expression", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], ParamMetadata.prototype, "paramType", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], ParamMetadata.prototype, "useValidation", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], ParamMetadata.prototype, "useConverter", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], ParamMetadata.prototype, "service", void 0);
exports.ParamMetadata = ParamMetadata;
//# sourceMappingURL=ParamMetadata.js.map