/**
 * @module di
 */
/** */
import {nameOf} from "../../core/utils/index";
import {Type} from "../../core/interfaces/Type";
/**
 * @private
 */
export class InjectionError extends Error {

    name = "INJECTION_ERROR";

    constructor(target: Type<any>, serviceName: string) {
        super(`Service ${nameOf(target)} > ${serviceName} not found.`);
    }
}