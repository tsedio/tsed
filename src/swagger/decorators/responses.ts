import {Store} from "@tsed/core";
import {Response} from "swagger-schema-official";

/**
 *
 * @param {string | number} status
 * @param {Response} response
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Responses(status: string | number, response: Response) {
  return Store.decorate((store: Store) => {
    store.merge("responses", {[status]: response});
  });
}
