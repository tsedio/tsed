import type {ConnectionOptions, DefaultJobOptions, QueueOptions, WorkerOptions} from "bullmq";

export type BullMQConfig = {
  /**
   * Specify queue name's to create
   */
  queues: string[];

  /**
   * Default connection to use for queue's and worker's
   */
  connection: ConnectionOptions;

  /**
   * @deprecated Use defaultQueueOptions instead. Will be removed in the next major release
   */
  defaultJobOptions?: DefaultJobOptions;

  /**
   * Default queue options which are applied to every queue
   *
   * Can be extended/overridden by `queueOptions`
   */
  defaultQueueOptions?: Omit<QueueOptions, "connection">;

  /**
   * Specify additional queue options by queue name
   */
  queueOptions?: Record<string, Omit<QueueOptions, "connection">>;

  /**
   * Disable the creation of any worker.
   *
   * All other worker configuration will be ignored
   */
  disableWorker?: boolean;

  /**
   * Specify for which queues to start a worker for.
   *
   * Defaultly for every queue added in the `queues` parameter
   */
  workerQueues?: string[];

  /**
   * Default worker options which are applied to every worker
   *
   * Can be extended/overridden by `workerOptions`
   */
  defaultWorkerOptions?: Omit<WorkerOptions, "connection">;

  /**
   * Specify additional worker options by queue name
   */
  workerOptions?: Record<string, Omit<WorkerOptions, "connection">>;
};

declare global {
  namespace TsED {
    interface Configuration {
      bullmq?: BullMQConfig;
    }
  }
}
