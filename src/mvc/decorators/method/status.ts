import {Store} from "../../../core/class/Store";
import {DecoratorParameters} from "../../../core/interfaces";
import {IResponseOptions} from "../../interfaces/IResponseOptions";
import {mapReturnedResponse} from "../../utils/mapReturnedResponse";
/**
 * @module common/mvc
 */
/** */
import {UseAfter} from "./useAfter";

/**
 * Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * ```typescript
 * @Status(204)
 * async myMethod() {}
 * ```
 *
 * With swagger description:
 *
 * ```typescript
 * @Status(204, {
 *   type: Model
 *   description: "Description"
 * })
 * @Header('Content-Type', 'application-json')
 * async myMethod() {
 * }
 * ```
 *
 * This example will produce the swagger responses object:
 *
 * ```json
 * {
 *   "responses": {
 *     "404": {
 *       "description": "Description",
 *       "headers": {
 *          "Content-Type": {
 *             "type": "string"
 *          }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param code
 * @param options
 * @returns {Function}
 * @decorator
 */
export function Status(code: number, options: IResponseOptions = {}) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.set("statusCode", code);

        const response = mapReturnedResponse(options);
        store.merge("response", response);
        store.merge("responses", {[code]: response});

        return UseAfter((request: any, response: any, next: any) => {
            response.status(code);
            next();
        });
    });
}
