import {nameOf, Type} from "@tsed/core";

/**
 * @private
 */
export class InjectionError extends Error {

    name = "INJECTION_ERROR";

    constructor(target: Type<any>, serviceName: string, message = "not found") {
        super(`Service ${nameOf(target)} > ${serviceName} ${message}.`);
    }
}