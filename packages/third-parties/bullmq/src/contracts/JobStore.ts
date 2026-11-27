import type {JobsOptions, RepeatOptions} from "bullmq";

/**
 * Job options accepted by `@JobController` and `JobDispatcher`.
 *
 * `repeat` is kept as a Ts.ED option: bullmq v6 removed it from `Queue.add()`,
 * so repeating jobs are registered through `Queue.upsertJobScheduler()`.
 */
export type JobOptions = Omit<JobsOptions, "repeat"> & {
  repeat?: Omit<RepeatOptions, "key">;
};

export interface JobStore {
  name: string;
  queue: string;
  opts: JobOptions;
}
