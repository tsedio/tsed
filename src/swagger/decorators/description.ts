import {Store} from "../../core/class/Store";
import {getDecoratorType} from "../../core/utils";
import {BaseParameter} from "./baseParameter";
import {Operation} from "./operation";

/**
 * Add a description metadata on the decorated element
 * @param {string} description
 * @returns {Function}
 * @decorator
 */
export function Description(description: string) {

    return (...args: any[]) => {
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter":
                return BaseParameter({description})(...args);
            case "method":
                return Operation({description})(...args);
            default:
                Store.from(...args).set("description", description);
        }
    };
}