/**
 * @module mvc
 */
/** */
import {UseAfter} from "./useAfter";
import {EndpointRegistry} from "../../registries/EndpointRegistry";
import {Type} from "../../../core/interfaces/Type";
/**
 * Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * ```typescript
 *  @Status(403)
 *  private myMethod() {}
 * ```
 *
 * @param code
 * @param options
 * @returns {Function}
 * @decorator
 */
export function Status(code: number, options: { description?: string, use?: Type<any>, collection?: Type<any> } = {}): Function {

    return <T>(target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        const endpoint = EndpointRegistry.get(target as any, targetKey);

        endpoint
            .store
            .merge("responses", {
                [code]: {
                    description: options.description,
                    type: options.use,
                    collectionType: options.collection
                }
            });

        return UseAfter((request, response, next) => {
            if (!response.headersSent) {
                response.status(code);
            }

            next();

        })(target, targetKey, descriptor);

    };
}
