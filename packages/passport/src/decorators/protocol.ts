import {Type} from "@tsed/core";
import {IProtocolOptions} from "../interfaces/IProtocolOptions";
import {ProtocolRegistry, registerProtocol} from "../registries/ProtocolRegistries";

export type ProtocolOptionsDecorator<T = any> = {name: string} & Partial<IProtocolOptions<T>>;

export function Protocol<T = any>(settings: ProtocolOptionsDecorator<T>) {
  return (target: Type<any>) => {
    registerProtocol(target);
    ProtocolRegistry.get(target)!.store.set("protocol", settings);
  };
}
