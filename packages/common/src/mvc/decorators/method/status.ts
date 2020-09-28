import {ReturnsChainedDecorators} from "@tsed/schema";
import {ReturnType, ReturnTypeOptions} from "./returnType";

/**
 * Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * ```typescript
 * @Status(204).Type(Model).Description("Description").ContentType('application/json')
 * async myMethod() {}
 * ```
 *
 * @param code
 * @returns {Function}
 * @decorator
 * @operation
 * @response
 * @alias @Returns decorator from @tsed/schema
 */
export function Status(code: number): ReturnsChainedDecorators;
/**
 *
 * @param code
 * @param options
 * @deprecated Since v6.
 */
export function Status(code: number, options: Partial<ReturnTypeOptions>): ReturnsChainedDecorators;
/**
 * Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * @param code
 * @param options
 * @deprecated Since v6.
 */
export function Status(code: number, options: Partial<ReturnTypeOptions> = {}): ReturnsChainedDecorators {
  return ReturnType({
    ...options,
    code,
    collectionType: (options as any).collection || options.collectionType,
    type: (options as any).use || options.type
  });
}
