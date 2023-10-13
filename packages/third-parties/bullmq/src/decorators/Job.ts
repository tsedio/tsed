import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {JobsOptions} from "bullmq";

export function Job(name: string, queue: string = "default", opts: JobsOptions = {}) {
  return useDecorators(
    StoreMerge("bullmq", {
      name,
      queue,
      opts
    }),
    Injectable({
      provide: `bullmq.job.${name}`,
      type: opts.repeat ? "bullmq:cron" : "bullmq:job"
    })
  );
}
