import {EveryOptions} from "../decorators/every";
import {DefineOptions} from "../decorators/define";

export interface AgendaStore {
  namespace?: string;
  define?: {[propertyKey: string]: {descriptor: PropertyDescriptor; options?: DefineOptions}};
  every?: {[propertyKey: string]: {options: EveryOptions}};
}
