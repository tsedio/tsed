/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Deprecated() {
    return Store.decorate((store: Store) => {
        store.set("deprecated", true);
    });
}