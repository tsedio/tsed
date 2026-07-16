import {BullMQConfig} from "../config/config.js";
import type {WorkerOptions} from "bullmq";
import {deepMerge} from "@tsed/core";

export function mapWorkerOptions(queue: string, bullMQConfig: BullMQConfig): WorkerOptions {
  return deepMerge<WorkerOptions, WorkerOptions>(
    {
      connection: bullMQConfig.connection,
      ...bullMQConfig.defaultWorkerOptions
    },
    bullMQConfig.workerOptions?.[queue]
  )!;
}
