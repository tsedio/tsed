import {Store} from "@tsed/core";
/**
 * @module common/mvc
 */
/** */
import {UseAfter} from "./useAfter";

/**
 * Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type.
 * If type contains the “/” character, then it sets the `Content-Type` to type.
 *
 * <<< @/docs/docs/snippets/controllers/response-content-type.ts
 *
 * @param type
 * @returns {Function}
 * @decorator
 */
export function ContentType(type: string) {
  return Store.decorate((store: Store) => {
    store.merge("produces", [type]);

    return UseAfter((request: any, response: any, next: any) => {
      response.type(type);
      next();
    });
  });
}
