import {applyDecorators, StoreSet} from "@tsed/core";
import {Configuration} from "@tsed/di";
import {IProtocolOptions} from "../interfaces/IProtocolOptions";
import {registerProtocol} from "../registries/ProtocolRegistries";

/**
 * Declare a new Protocol base on a Passport Strategy
 *
 * @decorator
 * @class
 */
export function Protocol<T = any>(options: ProtocolOptionsDecorator<T>) {
  return applyDecorators(
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

export type ProtocolOptionsDecorator<T = any> = {name: string} & Partial<IProtocolOptions<T>>;
