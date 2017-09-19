import {getDecoratorType} from "../../core/utils";
import {ControllerRegistry} from "../../mvc/registries/ControllerRegistry";
import {BaseParameter} from "./baseparameter";
import {Operation} from "./operation";
import {Schema} from "./schema";
import {Tag} from "./tag";

/**
 *
 * @param {string} description
 * @returns {Function}
 * @decorator
 */
export function Description(description: string) {

    return (...args: any[]) => {
        const [target] = args;
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter":
                return BaseParameter({description})(...args);
            case "method":
                return Operation({description})(...args);
            case "class":
                if (ControllerRegistry.has(target)) return Tag({description})(...args);
            default:
                return Schema({description})(...args);
        }
    };
}