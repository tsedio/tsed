/**
 * @module mvc
 */ /** */

import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";
/**
 * @private
 */
export class UnknowControllerError extends InternalServerError {

    name: "UNKNOW_CONTROLLER_ERROR";

    constructor(target: Type<any> | string) {
        super(UnknowControllerError.buildMessage(target));
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any> | string) {
        return `Controller ${nameOf(target)} not found.`;
    }
}