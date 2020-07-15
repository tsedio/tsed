import {Security as S} from "@tsed/schema";

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
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @operation
 * @ignore
 * @deprecated Use @Security from @tsed/schema
 */
export function Security(securityDefinitionName: string, ...scopes: string[]): Function {
  return S(securityDefinitionName, ...scopes);
}
