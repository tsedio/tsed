"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const converters_1 = require("../../converters");
const ParseExpressionError_1 = require("../errors/ParseExpressionError");
const RequiredParamError_1 = require("../errors/RequiredParamError");
const UnknowFilterError_1 = require("../errors/UnknowFilterError");
const ParamTypes_1 = require("../models/ParamTypes");
const ValidationService_1 = require("../services/ValidationService");
class ParamBuilder {
    constructor(param) {
        this.param = param;
    }
    /**
     *
     * @param param
     * @param injector
     * @returns {(value: any) => any}
     */
    static getConverterPipe(param, injector) {
        if (!param.useConverter) {
            return;
        }
        const converterService = injector.get(converters_1.ConverterService);
        return (value) => {
            return converterService.deserialize(value, param.collectionType || param.type, param.type);
        };
    }
    /**
     *
     * @param param
     * @param injector
     * @returns {(value: any) => any}
     */
    static getValidationPipe(param, injector) {
        const { collectionType } = param;
        const type = param.type || param.collectionType;
        if (!param.useValidation || (param.useValidation && !type)) {
            return;
        }
        const validationService = injector.get(ValidationService_1.ValidationService);
        return (value) => {
            try {
                validationService.validate(value, type, collectionType);
            }
            catch (err) {
                throw new ParseExpressionError_1.ParseExpressionError(core_1.nameOf(param.service), param.expression, err);
            }
            return value;
        };
    }
    static getParseExpressionPipe(param) {
        const { service, type } = param;
        let { expression } = param;
        if (typeof service !== "string" || !expression) {
            return;
        }
        if (service === ParamTypes_1.ParamTypes.HEADER) {
            expression = (param.expression || "").toLowerCase();
        }
        return (value) => {
            value = core_1.getValue(expression, value);
            if ([ParamTypes_1.ParamTypes.QUERY, ParamTypes_1.ParamTypes.PATH].includes(service) && value === "" && type !== String) {
                return undefined;
            }
            return value;
        };
    }
    /**
     *
     * @param {ParamMetadata} param
     * @returns {(value: any) => any}
     */
    static getRequiredPipe(param) {
        if (!param.required) {
            return;
        }
        return (value) => {
            if (param.isRequired(value)) {
                throw new RequiredParamError_1.RequiredParamError(core_1.nameOf(param.service), param.expression);
            }
            return value;
        };
    }
    static getInitialPipe(param, injector) {
        const requestPipe = context => context.request;
        const responsePipe = context => context.response;
        const contextPipe = context => requestPipe(context).ctx;
        switch (param.service) {
            case ParamTypes_1.ParamTypes.BODY:
                return context => requestPipe(context).body;
            case ParamTypes_1.ParamTypes.QUERY:
                return context => requestPipe(context).query;
            case ParamTypes_1.ParamTypes.PATH:
                return context => requestPipe(context).params;
            case ParamTypes_1.ParamTypes.HEADER:
                return context => requestPipe(context).headers;
            case ParamTypes_1.ParamTypes.COOKIES:
                return context => requestPipe(context).cookies;
            case ParamTypes_1.ParamTypes.SESSION:
                return context => requestPipe(context).session;
            case ParamTypes_1.ParamTypes.LOCALS:
                return context => responsePipe(context).locals;
            case ParamTypes_1.ParamTypes.RESPONSE:
                return responsePipe;
            case ParamTypes_1.ParamTypes.REQUEST:
                return requestPipe;
            case ParamTypes_1.ParamTypes.NEXT_FN:
                return context => context.next;
            case ParamTypes_1.ParamTypes.ERR:
                return context => context.err;
            case ParamTypes_1.ParamTypes.CONTEXT:
                return contextPipe;
            case ParamTypes_1.ParamTypes.ENDPOINT_INFO:
                return context => contextPipe(context).endpoint;
            case ParamTypes_1.ParamTypes.RESPONSE_DATA:
                return context => contextPipe(context).data;
            default:
                return this.getInvokableFilter(param, injector);
        }
    }
    static getInvokableFilter(param, injector) {
        const target = param.service;
        const { expression } = param;
        return (context) => {
            const instance = injector.get(target);
            if (!instance || !instance.transform) {
                throw new UnknowFilterError_1.UnknowFilterError(target);
            }
            return instance.transform(expression, context.request, context.response);
        };
    }
    static getOperatorsPipe(param, injector) {
        const operators = [
            this.getInitialPipe(param, injector),
            this.getParseExpressionPipe(param),
            this.getRequiredPipe(param),
            this.getValidationPipe(param, injector),
            this.getConverterPipe(param, injector)
        ]
            .filter(Boolean)
            .map(o => operators_1.map(o));
        return (value) => rxjs_1.of(value)
            // @ts-ignore
            .pipe(...operators)
            .pipe(operators_1.catchError(e => rxjs_1.of(e)));
    }
    static getContextPipe(param) {
        return (context) => (Object.assign(Object.assign({}, context), { param, expression: param.expression }));
    }
    build(injector) {
        const { param } = this;
        const subject = new rxjs_1.Subject();
        const observable = subject.pipe(operators_1.map(ParamBuilder.getContextPipe(param)), operators_1.switchMap(ParamBuilder.getOperatorsPipe(param, injector)));
        return { subject, observable };
    }
}
exports.ParamBuilder = ParamBuilder;
//# sourceMappingURL=ParamBuilder.js.map