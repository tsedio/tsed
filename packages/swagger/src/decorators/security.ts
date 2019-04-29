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
 * @decorator
 * @swagger
 */
export function Security(securityDefinitionName: string, ...scopes: string[]): Function {
  return Operation({security: [{[securityDefinitionName]: scopes}]});
}
