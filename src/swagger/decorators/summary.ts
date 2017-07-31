/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Summary(summary: string) {
    return (...args) => {
        Store.from(...args).merge("summary", summary);
        return args[2];
    };
}