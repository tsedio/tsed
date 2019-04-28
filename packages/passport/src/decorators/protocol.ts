import {Type} from "@tsed/core";
import {IProtocolOptions} from "../interfaces/IProtocolOptions";
import {ProtocolRegistry, registerProtocol} from "../registries/ProtocolRegistries";

export type ProtocolOptionsDecorator = {name: string} & Partial<IProtocolOptions>;

export function Protocol(settings: ProtocolOptionsDecorator) {
  return (target: Type<any>) => {
    registerProtocol(target);
    ProtocolRegistry.get(target)!.store.set("protocol", settings);
  };
}
