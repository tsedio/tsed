"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_httpexceptions_1 = require("ts-httpexceptions");
/**
 * @private
 */
class ParseExpressionError extends ts_httpexceptions_1.BadRequest {
    constructor(name, expression, err = {}) {
        super(ParseExpressionError.buildMessage(name, expression, err.message));
        this.errorMessage = this.message;
        this.dataPath = String(expression) || "";
        this.requestType = name;
        this.origin = err.origin || err;
    }
    /**
     *
     * @param name
     * @param expression
     * @param message
     * @returns {string}
     */
    static buildMessage(name, expression, message) {
        name = name.toLowerCase().replace(/parse|params|filter/gi, "");
        return `Bad request on parameter "request.${name}${expression ? "." + expression : ""}".\n${message}`.trim();
    }
}
exports.ParseExpressionError = ParseExpressionError;
//# sourceMappingURL=ParseExpressionError.js.map