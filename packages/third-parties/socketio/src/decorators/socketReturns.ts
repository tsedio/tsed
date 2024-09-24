import {Store} from "@tsed/core";

import {SocketReturnsTypes} from "../interfaces/SocketReturnsTypes.js";

/**
 *
 * @param {string} eventName
 * @param {SocketReturnsTypes} type
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => void}
 * @decorator
 */
export function SocketReturns(eventName: string, type: SocketReturnsTypes) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Store.from(target).merge("socketIO", {
      handlers: {
        [propertyKey]: {
          returns: {
            eventName,
            type
          }
        }
      }
    });
  };
}
