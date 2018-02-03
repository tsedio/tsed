/**
 * @module common/mvc
 */
/** */

import {BadRequest} from "ts-httpexceptions";

/**
 * @private
 */
export class ParseExpressionError extends BadRequest {
    dataPath: string;
    requestType: string;
    errorMessage: string;

    constructor(name: string, expression: string | RegExp | undefined, message?: string) {
        super(ParseExpressionError.buildMessage(name, expression, message));
        this.errorMessage = this.message;
        this.dataPath = String(expression) || "";
        this.requestType = name;
    }

    /**
     *
     * @param name
     * @param expression
     * @param message
     * @returns {string}
     */
    static buildMessage(name: string, expression: string | RegExp | undefined, message?: string) {
        name = name.toLowerCase().replace(/parse|params|filter/gi, "");


        return `Bad request on parameter "request.${name}${expression ? "." + expression : ""}".\n${message}`.trim();
    }
}