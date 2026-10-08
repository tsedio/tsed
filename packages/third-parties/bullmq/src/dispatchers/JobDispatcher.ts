import {Job as BullMQJob, Queue} from "bullmq";
import {JobMethods, type JobOptions, type JobStore} from "../contracts/index.js";
import {Store, Type, isClass} from "@tsed/core";
import {inject, injectable} from "@tsed/di";
import {BULLMQ} from "../constants/constants.js";
import type {JobDispatcherOptions} from "./JobDispatcherOptions.js";
import {getJobToken} from "../utils/getJobToken.js";
import {getQueueToken} from "../utils/getQueueToken.js";

export class JobDispatcher {
  public async dispatch<T extends JobMethods>(job: Type<T>, payload?: Parameters<T["handle"]>[0], options?: JobOptions): Promise<BullMQJob>;
  public async dispatch<P = unknown>(job: JobDispatcherOptions, payload?: P, options?: JobOptions): Promise<BullMQJob>;
  public async dispatch<P = unknown>(job: string, payload?: P, options?: JobOptions): Promise<BullMQJob>;
  public async dispatch(job: Type | JobDispatcherOptions | string, payload: unknown, options: JobOptions = {}): Promise<BullMQJob> {
    const {queueName, jobName, defaultJobOptions} = await this.resolveDispatchArgs(job, payload);

    const queue = inject<Queue>(getQueueToken(queueName));

    if (!queue) {
      throw new Error(`Queue(${queueName}) not defined`);
    }

    const {repeat, ...opts} = {
      ...defaultJobOptions,
      ...options
    };

    if (repeat) {
      const {jobId, ...template} = opts;

      // bullmq v6 removed the `repeat` option from Queue.add(): repeating jobs are handled by a job scheduler
      return queue.upsertJobScheduler(jobId || jobName, repeat, {name: jobName, data: payload, opts: template});
    }

    return queue.add(jobName, payload, opts);
  }

  private async resolveDispatchArgs(job: Type | JobDispatcherOptions | string, payload: unknown) {
    let queueName: string;
    let jobName: string;
    let defaultJobOptions: JobOptions | undefined;

    if (typeof job === "function") {
      // job is passed as a Type
      const store = Store.from(job).get<JobStore>(BULLMQ);
      queueName = store.queue;
      jobName = store.name;

      defaultJobOptions = await this.retrieveJobOptionsFromClassBasedJob(store, payload);
    } else if (typeof job === "object") {
      // job is passed as JobDispatcherOptions
      queueName = job.queue;
      jobName = job.name;
    } else {
      // job is passed as a string
      queueName = "default";
      jobName = job;
    }

    return {
      queueName,
      jobName,
      defaultJobOptions
    };
  }

  private async retrieveJobOptionsFromClassBasedJob(store: JobStore, payload: unknown): Promise<JobOptions> {
    const job = inject<JobMethods>(getJobToken(store.queue, store.name));
    const jobId = await job.jobId?.(payload);

    if (jobId === undefined) {
      return store.opts;
    }

    return {
      ...store.opts,
      jobId
    };
  }
}

injectable(JobDispatcher);
