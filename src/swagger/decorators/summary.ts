import {getDecoratorType} from "../../core/utils";
import {Operation} from "./operation";

/**
 * Add summary metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Summary("summary")
 *    id: string;
 * }
 * ```
 *
 * @param {string} summary
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Summary(summary: string) {
    return (...args: any[]) => {
        const type = getDecoratorType(args);
        switch (type) {
            case "method":
                return Operation({summary})(...args);
            default:
                throw new Error("Summary is only supported on method");
        }
    };
}