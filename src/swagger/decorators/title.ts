import {getDecoratorType} from "../../core/utils";
import * as mod from "../../jsonschema/decorators/title";
import {BaseParameter} from "./baseParameter";

const originalTitleDecorator = mod.Title;

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
 ```typescript
 * class Model {
 *    @Title("title")
 *    id: string;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "id": {
 *        "type": "string",
 *        "title": "title"
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} title
 * @returns {(...args: any[]) => any}
 * @decorator
 * @swagger
 */
function Title(title: string) {
    return (...args: any[]) => {
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter":
                return BaseParameter({title})(...args);
            default:
                originalTitleDecorator(title)(...args);
        }
    };
}

(mod as any).Title = Title;

export {
    Title
};