/**
 * @module mvc
 */
/** */

import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";

/**
 * @private
 */
export class UnknowFilterError extends InternalServerError {

    name: "UNKNOW_FILTER_ERROR";
    status: 500;

    constructor(target: Type<any> | string) {
        super(UnknowFilterError.buildMessage(target));
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any> | string) {
        return `Filter ${nameOf(target)} not found.`;
    }
}