import {StoreSet, useDecorators} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {ProtocolOptions} from "../interfaces/ProtocolOptions";
import {registerProtocol} from "../registries/ProtocolRegistries";

/**
 * Declare a new Protocol base on a Passport Strategy
 *
 * @decorator
 * @class
 */
export function Protocol<T = any>(options: ProtocolOptionsDecorator<T>) {
  return useDecorators(
    registerProtocol,
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
