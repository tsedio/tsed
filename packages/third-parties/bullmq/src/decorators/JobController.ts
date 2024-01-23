import {StoreMerge, useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {JobsOptions} from "bullmq";
import {BullMQTypes} from "../constants/BullMQTypes";
import {BULLMQ} from "../constants/constants";
import {getFallbackJobToken, getJobToken} from "../utils/getJobToken";

export function JobController(name: string, queue: string = "default", opts: JobsOptions = {}) {
  return useDecorators(
    StoreMerge(BULLMQ, {
      name,
      queue,
      opts
    }),
    Injectable({
      provide: getJobToken(queue, name),
      type: opts.repeat ? BullMQTypes.CRON : BullMQTypes.JOB
    })
  );
}

export function FallbackJobController(queue?: string) {
  return useDecorators(
    StoreMerge(BULLMQ, {
      queue
    }),
    Injectable({
      provide: getFallbackJobToken(queue),
      type: BullMQTypes.FALLBACK_JOB
    })
  );
}
