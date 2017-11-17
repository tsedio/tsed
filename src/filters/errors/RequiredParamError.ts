/**
 * @module common/mvc
 */ /** */

import {BadRequest} from "ts-httpexceptions";
/**
 * @private
 */
export class RequiredParamError extends BadRequest {

    constructor(name: string, expression: string | RegExp) {
        super(RequiredParamError.buildMessage(name, "" + expression));
    }

    /**
     *
     * @param name
     * @param expression
     * @param message
     * @returns {string}
     */
    static buildMessage(name: string, expression: string) {
        name = name.toLowerCase().replace(/parse|params|filter/gi, "");

        return `Bad request, parameter request.${name}.${expression} is required.`;
    }
}