import {getDecoratorType} from "../../core/utils";
import {BaseParameter} from "./baseParameter";
import {Schema} from "./schema";

/**
 * Add title metadata on the decorated element.
 *
 * ## Examples
 * ### On parameter
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    async method(@Title("title") @BodyParams("id") id: string) {}
 * }
 * ````
 *
 * Will produce:
 *
 * ```json
 * {
 *   "name":"body",
 *   "in":"body",
 *   "title":"title"
 * }
 * ```
 *
 * ### On property
 *
 * ```typescript
 * class Model {
 *    @Title("title")
 *    id: string;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * "Model": {
 *   "title": "title",
 * }
 * ```
 *
 * @param {string} title
 * @returns {(...args: any[]) => any}
 * @decorator
 */
export function Title(title: string) {
    return (...args: any[]) => {

        const type = getDecoratorType(args);
        switch (type) {
            case "parameter":
                return BaseParameter({title})(...args);
            default:
                Schema({title})(...args);
        }
    };
}