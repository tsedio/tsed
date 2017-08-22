/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Deprecated() {
    return (...args: any[]) => {
        Store.from(...args).set("deprecated", true);
        return args[2];
    };
}