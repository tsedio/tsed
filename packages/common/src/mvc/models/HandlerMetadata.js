"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const constants_1 = require("../constants");
const HandlerType_1 = require("../interfaces/HandlerType");
const ParamRegistry_1 = require("../registries/ParamRegistry");
const ParamTypes_1 = require("./ParamTypes");
class HandlerMetadata {
    constructor(options) {
        this.injectable = false;
        this.type = HandlerType_1.HandlerType.FUNCTION;
        this.hasErrorParam = false;
        this.hasNextFunction = false;
        const { target, token, propertyKey, type = HandlerType_1.HandlerType.FUNCTION } = options;
        this.type = type;
        this.handler = propertyKey ? target.prototype[propertyKey] : target;
        if (propertyKey) {
            this.target = target;
            this.token = token;
            this.propertyKey = propertyKey;
            this.methodClassName = String(propertyKey);
            this.method = String(propertyKey);
            this.hasNextFunction = this.hasParamType(ParamTypes_1.ParamTypes.NEXT_FN);
            this.hasErrorParam = this.hasParamType(ParamTypes_1.ParamTypes.ERR);
            this.injectable = (core_1.Metadata.get(constants_1.PARAM_METADATA, target, propertyKey) || []).length > 0;
        }
        if (!this.injectable) {
            this.hasErrorParam = this.handler.length === 4;
            this.hasNextFunction = this.handler.length >= 3;
        }
    }
    /**
     * @deprecated
     */
    get services() {
        return this.parameters;
    }
    get parameters() {
        if (this.injectable) {
            return this.getParams();
        }
        // Emulate ParamMetadata
        const parameters = [];
        if (this.hasErrorParam) {
            parameters.push({ index: 0, service: ParamTypes_1.ParamTypes.ERR });
        }
        parameters.push({ index: parameters.length, service: ParamTypes_1.ParamTypes.REQUEST });
        parameters.push({ index: parameters.length, service: ParamTypes_1.ParamTypes.RESPONSE });
        if (this.hasNextFunction) {
            parameters.push({ index: parameters.length, service: ParamTypes_1.ParamTypes.NEXT_FN });
        }
        return parameters;
    }
    getParams() {
        return ParamRegistry_1.ParamRegistry.getParams(this.target, this.propertyKey) || [];
    }
    hasParamType(paramType) {
        return this.getParams().findIndex(p => p.service === paramType) > -1;
    }
}
exports.HandlerMetadata = HandlerMetadata;
//# sourceMappingURL=HandlerMetadata.js.map