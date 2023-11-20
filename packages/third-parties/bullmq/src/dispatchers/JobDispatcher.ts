/* eslint-disable require-await */
import {InjectorService, Service} from "@tsed/di";
import {JobMethods, type JobStore} from "../contracts";
import {Store, Type} from "@tsed/core";
import {Job as BullMQJob, JobsOptions, Queue} from "bullmq";
import type {JobDispatcherOptions} from "./JobDispatcher.options";

@Service()
export class JobDispatcher {
  constructor(private readonly injector: InjectorService) {}

  public async dispatch<T extends JobMethods>(
    job: Type<T>,
    payload?: Parameters<T["handle"]>[0],
    options?: JobsOptions
  ): Promise<BullMQJob>;
  public async dispatch<T = any>(job: JobDispatcherOptions, payload?: T, options?: JobsOptions): Promise<BullMQJob>;
  public async dispatch<T = any>(job: string, payload?: T, options?: JobsOptions): Promise<BullMQJob>;
  public async dispatch(job: Type | JobDispatcherOptions | string, payload: any, options: JobsOptions = {}): Promise<BullMQJob> {
    let queueName: string;
    let name: string;
    let defaultJobOptions: JobsOptions | undefined;

    if (typeof job === "function") {
      // job is passed as a Type
      const store = Store.from(job).get<JobStore>("bullmq");
      queueName = store.queue;
      name = store.name;
      defaultJobOptions = store.opts;
    } else if (typeof job === "object") {
      // job is passed as JobDispatcherOptions
      queueName = job.queue;
      name = job.name;
    } else {
      // job is passed as a string
      queueName = "default";
      name = job;
    }

    const queue = this.injector.get<Queue>(`bullmq.queue.${queueName}`);

    if (!queue) {
      throw new Error(`Queue(${queueName}) not defined`);
    }

    return queue.add(name, payload, {
      ...defaultJobOptions,
      ...options
    });
  }
}
