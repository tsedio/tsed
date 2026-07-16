import {StoreMerge, useDecorators} from "@tsed/core";
import {getFallbackJobToken, getJobToken} from "../utils/getJobToken.js";
import {BULLMQ} from "../constants/constants.js";
import {BullMQTypes} from "../constants/BullMQTypes.js";
import {Injectable} from "@tsed/di";
import {JobsOptions} from "bullmq";

export function JobController(name: string, queue: string = "default", opts: JobsOptions = {}) {
  return useDecorators(
    StoreMerge(BULLMQ, {
      name,
      queue,
      opts
    }),
    Injectable({
      token: getJobToken(queue, name),
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
      token: getFallbackJobToken(queue),
      type: BullMQTypes.FALLBACK_JOB
    })
  );
}
