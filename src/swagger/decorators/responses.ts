/**
 * @module swagger
 */
/** */

import {Store} from "../../core/class/Store";
import {Response} from "swagger-schema-official";

export function Responses(status: string | number, response: Response) {
    return (...args) => {
        Store.from(...args).merge("responses", {[status]: response});
        return args[2];
    };
}