import {Type, nameOf} from "@tsed/core";
/**
 * @private
 */
export class InjectionError extends Error {

    name = "INJECTION_ERROR";

    constructor(target: Type<any>, serviceName: string) {
        super(`Service ${nameOf(target)} > ${serviceName} not found.`);
    }
}