/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Deprecated() {
    return (...args) => {
        Store.from(...args).set("deprecated", true);
        return args[2];
    };
}