import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {JobsOptions} from "bullmq";

export function JobController(name: string, queue: string = "default", opts: JobsOptions = {}) {
  return useDecorators(
    StoreMerge("bullmq", {
      name,
      queue,
      opts
    }),
    Injectable({
      provide: `bullmq.job.${queue}.${name}`,
      type: opts.repeat ? "bullmq:cron" : "bullmq:job"
    })
  );
}

export function FallbackJobController(queue?: string) {
  return useDecorators(
    StoreMerge("bullmq", {
      queue
    }),
    Injectable({
      provide: "bullmq.fallback-job" + (queue ? `.${queue}` : ""),
      type: "bullmq:fallback-job"
    })
  );
}
