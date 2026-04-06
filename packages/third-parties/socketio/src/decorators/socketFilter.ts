import {Store} from "@tsed/core";

import {SocketFilters} from "../interfaces/SocketFilters.js";

/**
 *
 * @param {SocketFilters} filter
 * @param {number} mapIndex
 * @decorator
 */
export function SocketFilter(filter: SocketFilters, mapIndex?: number) {
  return (target: Object, propertyKey: string, index: number) => {
    Store.from(target).merge("socketIO", {
      handlers: {
        [propertyKey]: {
          parameters: {
            [index]: {
              filter,
              mapIndex
            }
          }
        }
      }
    });
  };
}
