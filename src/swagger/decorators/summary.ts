/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Summary(summary: string) {
    return Store.decorate((store: Store) => {
        store.merge("summary", summary);
    });
}