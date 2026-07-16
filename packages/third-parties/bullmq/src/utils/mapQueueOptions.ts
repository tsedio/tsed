import {BullMQConfig} from "../config/config.js";
import type {QueueOptions} from "bullmq";
import {deepMerge} from "@tsed/core";

export function mapQueueOptions(queue: string, bullMQConfig: BullMQConfig): QueueOptions {
  return deepMerge<QueueOptions, QueueOptions>(
    {
      connection: bullMQConfig.connection,
      ...bullMQConfig.defaultQueueOptions
    },
    bullMQConfig.queueOptions?.[queue]
  )!;
}
