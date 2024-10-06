import {deepMerge} from "@tsed/core";
import type {WorkerOptions} from "bullmq";

import {BullMQConfig} from "../config/config.js";

export function mapWorkerOptions(queue: string, bullMQConfig: BullMQConfig): WorkerOptions {
  return deepMerge<WorkerOptions, WorkerOptions>(
    {
      connection: bullMQConfig.connection,
      ...bullMQConfig.defaultWorkerOptions
    },
    bullMQConfig.workerOptions?.[queue]
  )!;
}
