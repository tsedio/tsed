import {BeforeInit, DIContext, runInContext} from "@tsed/common";
import {Constant, InjectorService, Module} from "@tsed/di";
import {deepMerge} from "@tsed/core";
import {getComputedType} from "@tsed/schema";
import {Job, Queue, QueueOptions, Worker, WorkerOptions} from "bullmq";
import {v4} from "uuid";
import {BullMQConfig} from "./config/config";
import {JobMethods} from "./contracts";
import {JobDispatcher} from "./dispatchers";

@Module()
export class BullMQModule implements BeforeInit {
  @Constant("bullmq")
  private readonly bullmq: BullMQConfig;

  constructor(private readonly injector: InjectorService, private readonly dispatcher: JobDispatcher) {}

  $beforeInit() {
    if (!this.bullmq) {
      return;
    }

    this.buildWorkers();
    this.buildQueues();

    this.injector.getMany<JobMethods>("bullmq:cron").map((job) => this.dispatcher.dispatch(getComputedType(job)));
  }

  private buildQueues() {
    this.bullmq.queues.forEach((queue) => {
      const ops = deepMerge<QueueOptions, QueueOptions>(
        {
          connection: this.bullmq.connection,
          defaultJobOptions: this.bullmq.defaultJobOptions,
          ...this.bullmq.defaultQueueOptions
        },
        this.bullmq.queueOptions?.[queue]
      )!;

      this.injector
        .add(`bullmq.queue.${queue}`, {
          type: "bullmq:queue",
          useValue: new Queue(queue, ops),
          hooks: {
            $onDestroy: (queue) => queue.close()
          }
        })
        .invoke<Queue>(`bullmq.queue.${queue}`);
    });
  }

  private buildWorkers() {
    (this.bullmq.workerQueues ?? this.bullmq.queues).forEach((queue) => {
      const ops = deepMerge<WorkerOptions, WorkerOptions>(
        {
          connection: this.bullmq.connection,
          ...this.bullmq.defaultWorkerOptions
        },
        this.bullmq.workerOptions?.[queue]
      )!;

      this.injector
        .add(`bullmq.worker.${queue}`, {
          type: "bullmq:worker",
          useValue: new Worker(queue, this.onProcess.bind(this), ops),
          hooks: {
            $onDestroy: (worker) => worker.close()
          }
        })
        .invoke<Worker>(`bullmq.worker.${queue}`);
    });
  }

  private getJob(name: string, queueName: string) {
    return this.injector.get<JobMethods>(`bullmq.job.${queueName}.${name}`);
  }

  private async onProcess(job: Job) {
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
      id: job.id || v4().split("-").join("")
    });

    $ctx.set("BULLMQ_JOB", job);

    try {
      return await runInContext($ctx, () => jobService.handle(job.data, job));
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
  }
}
