/**
 * @module mvc
 */ /** */

import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";
/**
 * @private
 */
export class UnknowMiddlewareError extends InternalServerError {

    name: "UNKNOW_MIDDLEWARE_ERROR";

    constructor(target: Type<any> | string) {
        super(UnknowMiddlewareError.buildMessage(target));
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any> | string) {
        return `Middleware ${nameOf(target)} not found.`;
    }
}