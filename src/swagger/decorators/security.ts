import {getDecoratorType} from "../../core/utils";
import {Operation} from "./operation";

/**
 * Add security metadata on the decorated method.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    @Security("write:calendars")
 *    async method() {}
 * }
 * ```
 *
 * @param {string} securityDefinitionName
 * @param {string} scopes
 * @returns {(...args: any[]) => any}
 * @constructor
 */
export function Security(securityDefinitionName: string, ...scopes: string[]) {
    return (...args: any[]) => {
        const type = getDecoratorType(args);
        switch (type) {
            case "method":
                return Operation({security: [{[securityDefinitionName]: scopes}]})(...args);
            default:
                throw new Error("Security is only supported on method");
        }
    };
}