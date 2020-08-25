import {ReturnsChainedDecorators} from "@tsed/schema";
import {ReturnType} from "./returnType";

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
 * @deprecated
 */
export function Status(code: number, options: Partial<TsED.ResponseOptions>): ReturnsChainedDecorators;
/**
 * Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * @param code
 * @param options
 * @deprecated
 */
export function Status(code: number, options: Partial<TsED.ResponseOptions> = {}): ReturnsChainedDecorators {
  return ReturnType({
    ...options,
    code,
    collectionType: (options as any).collection || options.collectionType,
    type: (options as any).use || options.type
  });
}
