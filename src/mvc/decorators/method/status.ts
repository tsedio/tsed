import {Store} from "../../../core/class/Store";
import {Type} from "../../../core/interfaces/Type";
/**
 * @module common/mvc
 */
/** */
import {UseAfter} from "./useAfter";

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
    return Store.decorate((store: Store) => {
        store.merge("responses", {
            [code]: {
                description: options.description,
                type: options.use,
                collectionType: options.collection
            }
        });
        return UseAfter((request: any, response: any, next: any) => {
            if (!response.headersSent) {
                response.status(code);
            }

            next();
        });
    });
}
