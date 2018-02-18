import {getDecoratorType} from "@tsed/core";
import {Operation} from "./operation";

/**
 * Add deprecated metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Deprecated()
 *    id: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Deprecated() {
    return (...args: any[]) => {
        const type = getDecoratorType(args);
        switch (type) {
            case "method":
                return Operation({deprecated: true})(...args);
            default:
                throw new Error("Deprecated is only supported on method");
        }
    };
}