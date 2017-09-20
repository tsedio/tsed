import {Store} from "../../core/class/Store";
import {getDecoratorType} from "../../core/utils/index";
import {BaseParameter} from "./baseParameter";

/**
 * Add a name metadata on the decorated element
 * @returns {Function}
 * @decorator
 * @param name
 */
export function Name(name: string) {

    return (...args: any[]) => {
        const type = getDecoratorType(args);
        switch (type) {
            case "parameter":
                return BaseParameter({name})(...args);
            case "class":
                Store.from(...args).set("name", name);
                break;
            default:
                throw new Error("Name on Property and Method Not Supported");
        }
    };
}