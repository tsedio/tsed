import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable, ProviderType} from "@tsed/di";
import {JobsOptions} from "bullmq";

export type JobStore = {
  name: string;
  queue: string;
  opts: JobsOptions;
};

export function AsJob(name: string, queue: string = "default", opts: JobsOptions = {}) {
  return useDecorators(
    StoreMerge("bullmq", {
      name,
      queue,
      opts
    }),
    Injectable({
      provide: `bullmq.job.${name}`,
      type: opts.repeat ? "bullmq:cron" : undefined
    }),
    Injectable({
      type: "bullmq:job"
    })
  );
}
