import {DIContext, InjectorService, Module, OnDestroy, runInContext} from "@tsed/di";
import type {BeforeInit} from "@tsed/platform-http";
import {getComputedType} from "@tsed/schema";
import {Job, Queue, Worker} from "bullmq";
import {v4} from "uuid";

import {BullMQConfig} from "./config/config.js";
import {BullMQTypes} from "./constants/BullMQTypes.js";
import {BULLMQ} from "./constants/constants.js";
import {JobMethods, JobStore} from "./contracts/index.js";
import {JobDispatcher} from "./dispatchers/index.js";
import {createQueueProvider} from "./utils/createQueueProvider.js";
import {createWorkerProvider} from "./utils/createWorkerProvider.js";
import {getFallbackJobToken, getJobToken} from "./utils/getJobToken.js";
import {mapQueueOptions} from "./utils/mapQueueOptions.js";
import {mapWorkerOptions} from "./utils/mapWorkerOptions.js";

@Module()
export class BullMQModule implements BeforeInit, OnDestroy {
  constructor(
    private readonly injector: InjectorService,
    private readonly dispatcher: JobDispatcher
  ) {
    // build providers allow @Inject(queue) usage in JobController instance
    if (this.isEnabled()) {
      const queues = [...this.getUniqQueueNames()];

      this.buildQueues(queues);

      if (!this.isWorkerEnabled()) {
        const workers = this.config.workerQueues?.length ? this.config.workerQueues : queues;

        this.buildWorkers(workers);
      }
    }
  }

  get config() {
    return this.injector.settings.get<BullMQConfig>("bullmq");
  }

  $beforeInit() {
    if (this.isEnabled()) {
      this.injector.getMany<JobMethods>(BullMQTypes.CRON).map((job) => this.dispatcher.dispatch(getComputedType(job)));
    }
  }

  async $onDestroy() {
    if (!this.isEnabled()) {
      return;
    }

    await Promise.all(this.injector.getMany<Queue>(BullMQTypes.QUEUE).map((queue) => queue.close()));
    await Promise.all(this.injector.getMany<Worker>(BullMQTypes.WORKER).map((worker) => worker.close()));
  }

  isEnabled() {
    return !!this.config;
  }

  isWorkerEnabled() {
    return this.config.disableWorker;
  }

  private buildQueues(queues: string[]) {
    queues.forEach((queue) => {
      const opts = mapQueueOptions(queue, this.config);
      createQueueProvider(this.injector, queue, opts);
    });
  }

  private buildWorkers(workers: string[]) {
    workers.forEach((worker) => {
      const opts = mapWorkerOptions(worker, this.config);
      createWorkerProvider(this.injector, worker, this.onProcess, opts);
    });
  }

  /**
   * Auto discover queue names from provider and merge it with queue names from global configuration.
   * @private
   */
  private getUniqQueueNames() {
    return new Set(
      this.injector
        .getProviders([BullMQTypes.JOB, BullMQTypes.CRON, BullMQTypes.FALLBACK_JOB])
        .map((provider) => provider.store.get<JobStore>(BULLMQ)?.queue)
        .concat(this.config.queues!)
        .filter(Boolean)
    );
  }

  private getJob(name: string, queueName: string) {
    return (
      this.injector.get<JobMethods>(getJobToken(queueName, name)) ||
      this.injector.get(getFallbackJobToken(queueName)) ||
      this.injector.get(getFallbackJobToken())
    );
  }

  private onProcess = async (job: Job) => {
    const jobService = this.getJob(job.name, job.queueName);

    if (!jobService) {
      this.injector.logger.warn({
        event: "BULLMQ_JOB_NOT_FOUND",
        message: `Job ${job.name} ${job.queueName} not found`
      });
      return;
    }

    const $ctx = new DIContext({
      injector: this.injector,
      logger: this.injector.logger,
      id: job.id || v4().split("-").join(""),
      additionalProps: {
        logType: "bullmq",
        name: job.name,
        queue: job.queueName,
        attempt: job.attemptsMade
      }
    });

    $ctx.set("BULLMQ_JOB", job);

    try {
      return await runInContext($ctx, () => {
        $ctx.logger.info("Processing job");
        try {
          return jobService.handle(job.data, job);
        } finally {
          $ctx.logger.info("Finished processing job");
        }
      });
    } catch (er) {
      $ctx.logger.error({
        event: "BULLMQ_JOB_ERROR",
        message: er.message,
        stack: er.stack
      });
      throw er;
    } finally {
      await $ctx.destroy();
    }
  };
}
