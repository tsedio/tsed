import {Type} from "../../core/interfaces/Type";
/**
 * @module common/di
 */
/** */
import {nameOf} from "../../core/utils/index";
/**
 * @private
 */
export class InjectionError extends Error {

    name = "INJECTION_ERROR";

    constructor(target: Type<any>, serviceName: string) {
        super(`Service ${nameOf(target)} > ${serviceName} not found.`);
    }
}