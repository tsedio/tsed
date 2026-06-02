import {type JobDefinition} from "agenda";

type AgendaJobOptions = {
  timezone?: string;
  skipImmediate?: boolean;
  forkMode?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  skipDays?: number[];
};

export interface DefineOptions
  extends Partial<
    Pick<JobDefinition, "lockLimit" | "lockLifetime" | "concurrency" | "backoff" | "removeOnComplete" | "logging" | "priority">
  > {
  name?: string;
}

export type EveryOptions = AgendaJobOptions & DefineOptions;

export interface AgendaStore {
  namespace?: string;
  define?: {[propertyKey: string]: DefineOptions};
  every?: {[propertyKey: string]: EveryOptions & {interval: string}};
}
