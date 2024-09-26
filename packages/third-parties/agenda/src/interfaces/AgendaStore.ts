import type {DefineOptions as AgendaDefineOptions, JobOptions} from "agenda";

export interface DefineOptions extends AgendaDefineOptions {
  name?: string;
}

export type EveryOptions = JobOptions & DefineOptions;

export interface AgendaStore {
  namespace?: string;
  define?: {[propertyKey: string]: DefineOptions};
  every?: {[propertyKey: string]: EveryOptions & {interval: string}};
}
