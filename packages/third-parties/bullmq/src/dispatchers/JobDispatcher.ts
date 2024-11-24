import {isClass, Store, Type} from "@tsed/core";
import {inject, injectable} from "@tsed/di";
import {Job as BullMQJob, JobsOptions, Queue} from "bullmq";

import {BULLMQ} from "../constants/constants.js";
import {JobMethods, type JobStore} from "../contracts/index.js";
import {getJobToken} from "../utils/getJobToken.js";
import {getQueueToken} from "../utils/getQueueToken.js";
import type {JobDispatcherOptions} from "./JobDispatcherOptions.js";

export class JobDispatcher {
  public async dispatch<T extends JobMethods>(
    job: Type<T>,
    payload?: Parameters<T["handle"]>[0],
    options?: JobsOptions
  ): Promise<BullMQJob>;
  public async dispatch<P = unknown>(job: JobDispatcherOptions, payload?: P, options?: JobsOptions): Promise<BullMQJob>;
  public async dispatch<P = unknown>(job: string, payload?: P, options?: JobsOptions): Promise<BullMQJob>;
  public async dispatch(job: Type | JobDispatcherOptions | string, payload: unknown, options: JobsOptions = {}): Promise<BullMQJob> {
    const {queueName, jobName, defaultJobOptions} = await this.resolveDispatchArgs(job, payload);

    const queue = inject<Queue>(getQueueToken(queueName));

    if (!queue) {
      throw new Error(`Queue(${queueName}) not defined`);
    }

    return queue.add(jobName, payload, {
      ...defaultJobOptions,
      ...options
    });
  }

  private async resolveDispatchArgs(job: Type | JobDispatcherOptions | string, payload: unknown) {
    let queueName: string;
    let jobName: string;
    let defaultJobOptions: JobsOptions | undefined;

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

  private async retrieveJobOptionsFromClassBasedJob(store: JobStore, payload: unknown): Promise<JobsOptions> {
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
