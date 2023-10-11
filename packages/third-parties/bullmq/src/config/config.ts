import {type ConnectionOptions, type DefaultJobOptions} from "bullmq";

export type BullMQConfig = {
  queues: string[];
  connection: ConnectionOptions;
  defaultJobOptions?: DefaultJobOptions;
  disableWorker?: boolean;
  // optionally specify for which queues to start a worker for
  // in case not all queues should be worked on
  workerQueues?: string[];
};

declare global {
  namespace TsED {
    interface Configuration {
      bullmq?: BullMQConfig;
    }
  }
}
