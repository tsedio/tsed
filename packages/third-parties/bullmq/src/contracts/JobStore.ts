import {JobsOptions} from "bullmq";

export type JobStore = {
  name: string;
  queue: string;
  opts: JobsOptions;
};
