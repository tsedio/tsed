import {getDecoratorType} from "../../core/utils/index";
import {ControllerRegistry} from "../../mvc/registries/ControllerRegistry";
import {BaseParameter} from "./baseparameter";
import {Tag} from "./tag";
/**
 *
 * @param {string} description
 * @returns {Function}
 * @decorator
 */
export function Name(name: string) {

    return (...args: any[]) => {
        const [target] = args;
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter":
                return BaseParameter({name})(...args);
            case "class":
                if (ControllerRegistry.has(target)) return Tag({name})(...args);
            default:
                throw new Error("Name on Property and Method Not Supported");
        }
    };
}