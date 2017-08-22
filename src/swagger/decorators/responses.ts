/**
 * @module swagger
 */
/** */

import {Response} from "swagger-schema-official";
import {Store} from "../../core/class/Store";

export function Responses(status: string | number, response: Response) {
    return (...args: any[]) => {
        Store.from(...args).merge("responses", {[status]: response});
        return args[2];
    };
}