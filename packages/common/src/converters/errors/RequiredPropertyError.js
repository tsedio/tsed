"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * @private
 */
class RequiredPropertyError extends ts_httpexceptions_1.BadRequest {
    constructor(target, propertyName, value) {
        super(RequiredPropertyError.buildMessage(target, propertyName, value));
        this.errors = [
            {
                dataPath: "",
                keyword: "required",
                message: `should have required property '${String(propertyName)}'`,
                modelName: core_1.nameOf(target),
                params: {
                    missingProperty: propertyName
                },
                schemaPath: "#/required"
            }
        ];
    }
    /**
     *
     * @returns {string}
     * @param target
     * @param propertyName
     * @param value
     */
    static buildMessage(target, propertyName, value) {
        return `Property ${propertyName} on class ${core_1.nameOf(target)} is required. Given value: ${value}`;
    }
}
exports.RequiredPropertyError = RequiredPropertyError;
//# sourceMappingURL=RequiredPropertyError.js.map