import {StoreSet, useDecorators} from "@tsed/core";
import {Configuration, Injectable} from "@tsed/di";

import {PROVIDER_TYPE_PROTOCOL} from "../contants/constants.js";
import {ProtocolOptions} from "../interfaces/ProtocolOptions.js";

/**
 * Declare a new Protocol base on a Passport Strategy
 *
 * @decorator
 * @class
 */
export function Protocol<T = any>(options: ProtocolOptionsDecorator<T>) {
  return useDecorators(
    Injectable({
      type: PROVIDER_TYPE_PROTOCOL
    }),
    StoreSet("protocol", options),
    Configuration({
      passport: {
        protocols: {
          [options.name]: options
        }
      }
    })
  );
}

export type ProtocolOptionsDecorator<T = any> = {name: string} & Partial<ProtocolOptions<T>>;
