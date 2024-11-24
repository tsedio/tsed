import {
  constant,
  DIContext,
  inject,
  injectable,
  injectMany,
  injector,
  logger,
  OnDestroy,
  type OnInit,
  ProviderType,
  runInContext
} from "@tsed/di";
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

export class BullMQModule implements OnInit, OnDestroy {
  private readonly dispatcher = inject(JobDispatcher);

  constructor() {
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
    return constant<BullMQConfig>("bullmq")!;
  }

  $onInit() {
    if (this.isEnabled()) {
      injectMany<JobMethods>(BullMQTypes.CRON).map((job) => this.dispatcher.dispatch(getComputedType(job)));
    }
  }

  async $onDestroy() {
    if (!this.isEnabled()) {
      return;
    }

    await Promise.all(injectMany<Queue>(BullMQTypes.QUEUE).map((queue) => queue.close()));
    await Promise.all(injectMany<Worker>(BullMQTypes.WORKER).map((worker) => worker.close()));
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
      createQueueProvider(queue, opts);
    });
  }

  private buildWorkers(workers: string[]) {
    workers.forEach((worker) => {
      const opts = mapWorkerOptions(worker, this.config);
      createWorkerProvider(worker, this.onProcess, opts);
    });
  }

  /**
   * Auto discover queue names from provider and merge it with queue names from global configuration.
   * @private
   */
  private getUniqQueueNames() {
    return new Set(
      injector()
        .getProviders([BullMQTypes.JOB, BullMQTypes.CRON, BullMQTypes.FALLBACK_JOB])
        .map((provider) => provider.store.get<JobStore>(BULLMQ)?.queue)
        .concat(this.config.queues!)
        .filter(Boolean)
    );
  }

  private getJob(name: string, queueName: string) {
    return inject<JobMethods>(getJobToken(queueName, name)) || inject(getFallbackJobToken(queueName)) || inject(getFallbackJobToken());
  }

  private onProcess = async (job: Job) => {
    const jobService = this.getJob(job.name, job.queueName);

    if (!jobService) {
      logger().warn({
        event: "BULLMQ_JOB_NOT_FOUND",
        message: `Job ${job.name} ${job.queueName} not found`
      });
      return;
    }

    const $ctx = new DIContext({
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

injectable(BullMQModule).type(ProviderType.MODULE);
