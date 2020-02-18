"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const constants_1 = require("../constants");
const ParamMetadata_1 = require("../models/ParamMetadata");
class ParamRegistry {
    static get(target, propertyKey, index) {
        const params = this.getParams(target, propertyKey);
        if (!this.has(target, propertyKey, index)) {
            params[index] = new ParamMetadata_1.ParamMetadata({ target, propertyKey, index });
            this.set(target, propertyKey, index, params[index]);
        }
        return params[index];
    }
    static has(target, propertyKey, index) {
        return !!this.getParams(target, propertyKey)[index];
    }
    static set(target, propertyKey, index, paramMetadata) {
        const params = this.getParams(target, propertyKey);
        params[index] = paramMetadata;
        core_1.Metadata.set(constants_1.PARAM_METADATA, params, target, propertyKey);
    }
    static getParams(target, propertyKey) {
        return core_1.Metadata.has(constants_1.PARAM_METADATA, target, propertyKey) ? core_1.Metadata.get(constants_1.PARAM_METADATA, target, propertyKey) : [];
    }
    /**
     *
     * @param target
     * @param propertyKey
     * @param parameterIndex
     * @param allowedRequiredValues
     * @deprecated
     */
    // istanbul ignore next
    static required(target, propertyKey, parameterIndex, allowedRequiredValues = []) {
        const param = ParamRegistry.get(target, propertyKey, parameterIndex);
        param.required = true;
        param.allowedRequiredValues = allowedRequiredValues;
        param.store.merge("responses", {
            "400": {
                description: "BadRequest"
            }
        });
        return this;
    }
    /**
     * Create a parameters decorators
     * @param token
     * @param {Partial<IParamConstructorOptions<any>>} options
     * @returns {Function}
     * @deprecated
     */
    // istanbul ignore next
    static decorate(token, options = {}) {
        return (target, propertyKey, index) => {
            if (typeof index === "number") {
                const settings = Object.assign({
                    target,
                    propertyKey,
                    index
                }, options);
                ParamRegistry.useFilter(token, settings);
            }
        };
    }
    static useFilter(filter, options) {
        const { expression, useType, propertyKey, index, target, useConverter, useValidation } = options;
        let { paramType } = options;
        const param = ParamRegistry.get(target, propertyKey, index);
        if (typeof filter === "string") {
            paramType = filter;
        }
        param.service = filter;
        param.useValidation = !!useValidation;
        param.expression = expression;
        if (paramType) {
            param.paramType = paramType;
        }
        if (useType) {
            param.type = useType;
        }
        if (useConverter !== undefined) {
            param.useConverter = useConverter;
        }
        return param;
    }
}
tslib_1.__decorate([
    core_1.Deprecated("ParamRegistry.decorate are deprecated."),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Type, Object, Number, Array]),
    tslib_1.__metadata("design:returntype", void 0)
], ParamRegistry, "required", null);
tslib_1.__decorate([
    core_1.Deprecated("ParamRegistry.decorate are deprecated. Use UseFilter decorator instead"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Function)
], ParamRegistry, "decorate", null);
exports.ParamRegistry = ParamRegistry;
//# sourceMappingURL=ParamRegistry.js.map