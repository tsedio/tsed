/**
 * @module mvc
 */ /** */

import {InternalServerError} from "ts-httpexceptions";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";
/**
 * @private
 */
export class TemplateRenderingError extends InternalServerError {

    name: "TEMPLATING_RENDER_ERROR";

    constructor(target: Type<any> | string, method: string, err: Error) {
        super(TemplateRenderingError.buildMessage(target, method, err));
    }

    /**
     *
     * @returns {string}
     */
    static buildMessage(target: Type<any> | string, method: string, err: Error) {
        return `Template rendering error : ${nameOf(target)}.${method}()\n` + err;
    }
}