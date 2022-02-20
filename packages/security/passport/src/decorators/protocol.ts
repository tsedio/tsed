import {StoreSet, useDecorators} from "@tsed/core";
import {Configuration, Injectable} from "@tsed/di";
import {ProtocolOptions} from "../interfaces/ProtocolOptions";
import {PROVIDER_TYPE_PROTOCOL} from "../contants/constants";

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
