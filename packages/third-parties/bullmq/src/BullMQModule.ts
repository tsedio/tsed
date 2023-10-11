import {Constant, InjectorService, Module} from "@tsed/di";
import {JobDispatcher} from "./dispatchers";
import {BeforeInit} from "@tsed/common";
import {Job} from "./contracts";
import {getComputedType} from "@tsed/schema";
import {BullMQConfig} from "./config/config";
import {Queue, Worker} from "bullmq";
import ProcessorFactory from "./processors/ProcessorFactory";

@Module()
export class BullMQModule implements BeforeInit {
  @Constant("bullmq")
  private readonly bullmq: BullMQConfig;

  constructor(
    private readonly injector: InjectorService,
    private readonly dispatcher: JobDispatcher,
    private readonly factory: ProcessorFactory
  ) {}

  $beforeInit() {
    (this.bullmq.workerQueues ?? this.bullmq.queues).forEach((queue) => {
      this.injector
        .add(`bullmq.worker.${queue}`, {
          type: "bullmq:worker",
          useValue: new Worker(queue, this.factory.build(), {
            connection: this.bullmq.connection
          }),
          hooks: {
            $onDestroy: (worker) => worker.close()
          }
        })
        .invoke<Worker>(`bullmq.worker.${queue}`);
    });

    this.bullmq.queues.forEach((queue) => {
      this.injector
        .add(`bullmq.queue.${queue}`, {
          useValue: new Queue(queue, {
            connection: this.bullmq.connection,
            defaultJobOptions: this.bullmq.defaultJobOptions
          }),
          hooks: {
            $onDestroy: (queue) => queue.close()
          }
        })
        .invoke<Queue>(`bullmq.queue.${queue}`);
    });

    this.injector.getMany<Job>("bullmq:cron").map((job) => this.dispatcher.dispatch(getComputedType(job)));
  }
}
