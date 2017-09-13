/**
 * @module swagger
 */
/** */

import {Response} from "swagger-schema-official";
import {Store} from "../../core/class/Store";

export function Responses(status: string | number, response: Response) {
    return Store.decorate((store: Store) => {
        store.merge("responses", {[status]: response});
    });
}