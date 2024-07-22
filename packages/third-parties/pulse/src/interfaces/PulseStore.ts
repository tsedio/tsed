import {DefineOptions as PulseDefineOptions, JobOptions} from "@pulsecron/pulse";

export interface DefineOptions extends PulseDefineOptions {
  name?: string;
}

export type EveryOptions = JobOptions & DefineOptions;

export interface PulseStore {
  namespace?: string;
  define?: {[propertyKey: string]: DefineOptions};
  every?: {[propertyKey: string]: EveryOptions & {interval: string}};
}
