"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_httpexceptions_1 = require("ts-httpexceptions");
class RequiredParamError extends ts_httpexceptions_1.BadRequest {
    constructor(name, expression) {
        super(RequiredParamError.buildMessage(name, "" + expression));
        const type = name.toLowerCase().replace(/parse|params|filter/gi, "");
        this.errors = [
            {
                dataPath: "",
                keyword: "required",
                message: `should have required param '${expression}'`,
                modelName: type,
                params: {
                    missingProperty: expression
                },
                schemaPath: "#/required"
            }
        ];
    }
    /**
     *
     * @param name
     * @param expression
     * @returns {string}
     */
    static buildMessage(name, expression) {
        name = name.toLowerCase().replace(/parse|params|filter/gi, "");
        return `Bad request, parameter "${name === "request" ? name : "request." + name}.${expression}" is required.`;
    }
}
exports.RequiredParamError = RequiredParamError;
//# sourceMappingURL=RequiredParamError.js.map