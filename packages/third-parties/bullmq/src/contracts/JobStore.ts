import type {JobsOptions} from "bullmq";

export interface JobStore {
  name: string;
  queue: string;
  opts: JobsOptions;
}
