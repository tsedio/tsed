import {Returns, ReturnsChainedDecorators} from "@tsed/schema";
import {ReturnTypeOptions} from "./returnType";

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
 * @deprecated Since v6. Use @Status decorator from @tsed/schema
 * @ignore
 */
export function Status(code: number): ReturnsChainedDecorators;
/**
 *
 * @param code
 * @param options
 * @deprecated Since v6. Use @Status decorator from @tsed/schema
 * @ignore
 */
export function Status(code: number, options: ReturnTypeOptions): ReturnsChainedDecorators;
/**
 * Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * @param code
 * @param obj
 * @deprecated Since v6. Use @Status decorator from @tsed/schema
 * @ignore
 */
export function Status(code: number, obj: any = {}): ReturnsChainedDecorators {
  const options: Partial<ReturnTypeOptions> = obj;
  return Returns(code, {
    ...options,
    code,
    collectionType: (options as any).collection || options.collectionType,
    type: (options as any).use || options.type
  });
}
