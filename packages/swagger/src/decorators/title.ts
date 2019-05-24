import * as mod from "@tsed/common";
import {getDecoratorType} from "@tsed/core";
import {BaseParameter} from "./baseParameter";
import {Operation} from "./operation";

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
 * > Note: Title can be used on a method but swagger didn't use this key to describe an Operation.
 *
 * @param {string} title
 * @returns {(...args: any[]) => any}
 * @decorator
 * @swagger
 * @property
 * @method
 * @parameter
 */
function Title(title: string) {
  return (...args: any[]) => {
    const type = getDecoratorType(args);
    switch (type) {
      case "method":
        return Operation({title})(...args);
      case "parameter":
        return BaseParameter({title})(...args);
      default:
        originalTitleDecorator(title)(...args);
    }
  };
}

(mod as any).Title = Title;

export {Title};
