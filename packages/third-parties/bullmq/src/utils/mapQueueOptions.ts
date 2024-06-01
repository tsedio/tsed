import {deepMerge} from "@tsed/core";
import type {QueueOptions} from "bullmq";
import {BullMQConfig} from "../config/config.js";

export function mapQueueOptions(queue: string, bullMQConfig: BullMQConfig): QueueOptions {
  return deepMerge<QueueOptions, QueueOptions>(
    {
      connection: bullMQConfig.connection,
      defaultJobOptions: bullMQConfig.defaultJobOptions,
      ...bullMQConfig.defaultQueueOptions
    },
    bullMQConfig.queueOptions?.[queue]
  )!;
}
