"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * @private
 */
class UnknownPropertyError extends ts_httpexceptions_1.BadRequest {
    constructor(target, propertyName) {
        super(UnknownPropertyError.buildMessage(target, propertyName));
        this.errors = [
            {
                dataPath: "",
                keyword: "unknown",
                message: `should not have property '${String(propertyName)}'`,
                modelName: core_1.nameOf(target),
                params: {
                    missingProperty: propertyName
                },
                schemaPath: "#/unknown"
            }
        ];
    }
    /**
     *
     * @returns {string}
     * @param target
     * @param propertyName
     */
    static buildMessage(target, propertyName) {
        return `Property ${String(propertyName)} on class ${core_1.nameOf(target)} is not allowed.`;
    }
}
exports.UnknownPropertyError = UnknownPropertyError;
//# sourceMappingURL=UnknownPropertyError.js.map