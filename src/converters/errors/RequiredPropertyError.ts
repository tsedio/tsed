/**
 * @module common/mvc
 */
/** */

import {BadRequest} from "ts-httpexceptions";
import {Type} from "../../core/interfaces";
import {nameOf} from "../../core/utils";

/**
 * @private
 */
export class RequiredPropertyError extends BadRequest {

    constructor(target: Type<any>, propertyName: string | symbol) {
        super(RequiredPropertyError.buildMessage(target, propertyName));
    }

    /**
     *
     * @returns {string}
     * @param target
     * @param propertyName
     */
    static buildMessage(target: Type<any>, propertyName: string | symbol) {
        return `Property ${propertyName} on class ${nameOf(target)} is required.`;
    }
}