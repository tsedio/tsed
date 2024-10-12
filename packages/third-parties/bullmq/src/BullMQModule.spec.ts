import "./BullMQModule.js";

import {catchAsyncError} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Queue, Worker} from "bullmq";
import {anything, instance, mock, verify, when} from "ts-mockito";

import {BullMQModule} from "./BullMQModule.js";
import {type BullMQConfig} from "./config/config.js";
import {JobMethods} from "./contracts/index.js";
import {FallbackJobController, JobController} from "./decorators/index.js";
import {InjectQueue} from "./decorators/InjectQueue.js";
import {InjectWorker} from "./decorators/InjectWorker.js";
import {JobDispatcher} from "./dispatchers/index.js";

const queueConstructorSpy = vi.fn();
const workerConstructorSpy = vi.fn();

vi.mock("bullmq", () => {
  return {
    Queue: class {
      constructor(...args: any[]) {
        queueConstructorSpy(...args);
      }

      close() {}
    },
    Worker: class {
      constructor(...args: any[]) {
        workerConstructorSpy(...args);
      }

      close() {}
    }
  };
});

@JobController("cron", "default", {
  repeat: {
    pattern: "* * * * *"
  }
})
class CustomCronJob implements JobMethods {
  @InjectQueue("default")
  queue: Queue;

  @InjectWorker("default")
  worker: Worker;

  handle() {}
}

@JobController("regular", "default")
class RegularJob {
  handle() {}
}

describe("BullMQModule", () => {
  let dispatcher: JobDispatcher;

  beforeEach(() => {
    dispatcher = mock(JobDispatcher);
    when(dispatcher.dispatch(CustomCronJob)).thenResolve();
  });

  afterEach(PlatformTest.reset);

  describe("configuration", () => {
    beforeEach(() => {
      queueConstructorSpy.mockClear();
      workerConstructorSpy.mockClear();
    });

    describe("merges config correctly", () => {
      beforeEach(async () => {
        await PlatformTest.create({
          bullmq: {
            queues: ["default", "special"],
            connection: {
              connectionName: "defaultConnectionName"
            },
            defaultQueueOptions: {
              defaultJobOptions: {
                delay: 100
              },
              blockingConnection: true
            },
            queueOptions: {
              special: {
                connection: {
                  connectionName: "specialConnectionName"
                },
                defaultJobOptions: {
                  attempts: 9
                }
              }
            },
            defaultWorkerOptions: {
              connection: {
                connectTimeout: 123
              },
              concurrency: 50
            },
            workerOptions: {
              special: {
                concurrency: 1,
                lockDuration: 2
              }
            }
          },
          imports: [
            {
              token: JobDispatcher,
              use: instance(dispatcher)
            }
          ]
        });
      });

      it("queue", () => {
        expect(queueConstructorSpy).toHaveBeenCalledTimes(2);

        expect(queueConstructorSpy).toHaveBeenNthCalledWith(1, "default", {
          connection: {
            connectionName: "defaultConnectionName"
          },
          defaultJobOptions: {
            delay: 100
          },
          blockingConnection: true
        });

        expect(queueConstructorSpy).toHaveBeenNthCalledWith(2, "special", {
          connection: {
            connectionName: "specialConnectionName"
          },
          defaultJobOptions: {
            attempts: 9,
            delay: 100
          },
          blockingConnection: true
        });
      });

      it("worker", () => {
        expect(workerConstructorSpy).toHaveBeenCalledTimes(2);

        expect(workerConstructorSpy).toHaveBeenNthCalledWith(1, "default", expect.any(Function), {
          connection: {
            connectTimeout: 123
          },
          concurrency: 50
        });

        expect(workerConstructorSpy).toHaveBeenNthCalledWith(2, "special", expect.any(Function), {
          connection: {
            connectTimeout: 123
          },
          concurrency: 1,
          lockDuration: 2
        });
      });
    });

    describe("discover queues from decorators", () => {
      beforeEach(async () => {
        await PlatformTest.create({
          bullmq: {
            queues: ["special"],
            connection: {
              connectionName: "defaultConnectionName"
            },
            defaultQueueOptions: {
              defaultJobOptions: {
                delay: 100
              },
              blockingConnection: true
            },
            queueOptions: {
              special: {
                connection: {
                  connectionName: "specialConnectionName"
                },
                defaultJobOptions: {
                  attempts: 9
                }
              }
            },
            defaultWorkerOptions: {
              connection: {
                connectTimeout: 123
              },
              concurrency: 50
            },
            workerOptions: {
              special: {
                concurrency: 1,
                lockDuration: 2
              }
            }
          },
          imports: [
            {
              token: JobDispatcher,
              use: instance(dispatcher)
            }
          ]
        });
      });

      it("queue", () => {
        expect(queueConstructorSpy).toHaveBeenCalledTimes(2);

        expect(queueConstructorSpy).toHaveBeenNthCalledWith(1, "default", {
          connection: {
            connectionName: "defaultConnectionName"
          },
          defaultJobOptions: {
            delay: 100
          },
          blockingConnection: true
        });

        expect(queueConstructorSpy).toHaveBeenNthCalledWith(2, "special", {
          connection: {
            connectionName: "specialConnectionName"
          },
          defaultJobOptions: {
            attempts: 9,
            delay: 100
          },
          blockingConnection: true
        });
      });

      it("worker", () => {
        expect(workerConstructorSpy).toHaveBeenCalledTimes(2);

        expect(workerConstructorSpy).toHaveBeenNthCalledWith(1, "default", expect.any(Function), {
          connection: {
            connectTimeout: 123
          },
          concurrency: 50
        });

        expect(workerConstructorSpy).toHaveBeenNthCalledWith(2, "special", expect.any(Function), {
          connection: {
            connectTimeout: 123
          },
          concurrency: 1,
          lockDuration: 2
        });
      });
    });

    describe("disableWorker", () => {
      const config = {
        queues: ["default", "foo", "bar"],
        connection: {},
        disableWorker: true
      } as BullMQConfig;

      beforeEach(async () => {
        await PlatformTest.create({
          bullmq: config,
          imports: [
            {
              token: JobDispatcher,
              use: instance(dispatcher)
            }
          ]
        });
      });

      it("should not create any workers", () => {
        expect(workerConstructorSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("without", () => {
      it("skips initialization", async () => {
        await PlatformTest.create({
          imports: [
            {
              token: JobDispatcher,
              use: instance(dispatcher)
            }
          ]
        });

        expect(queueConstructorSpy).not.toHaveBeenCalled();
        verify(dispatcher.dispatch(anything())).never();
      });
    });
  });

  describe("functionality", () => {
    const config = {
      queues: ["default", "foo", "bar"],
      connection: {},
      workerQueues: ["default", "foo"]
    } as BullMQConfig;

    beforeEach(async () => {
      await PlatformTest.create({
        bullmq: config,
        imports: [
          {
            token: JobDispatcher,
            use: instance(dispatcher)
          }
        ]
      });
    });

    describe("cronjobs", () => {
      it("should dispatch cron jobs automatically", () => {
        verify(dispatcher.dispatch(CustomCronJob)).once();
      });
    });

    describe("queues", () => {
      it("should get default", () => {
        const instance = PlatformTest.get<Queue>("bullmq.queue.default");

        expect(instance).toBeInstanceOf(Queue);
      });

      it.each(config.queues!)("should register queue(%s)", (queue) => {
        const instance = PlatformTest.get<Queue>(`bullmq.queue.${queue}`);

        expect(instance).toBeInstanceOf(Queue);
      });

      it("should not allow direct injection of the queue", () => {
        expect(PlatformTest.get(Queue)).not.toBeInstanceOf(Queue);
      });
    });

    describe("workers", () => {
      it("should get default", () => {
        const instance = PlatformTest.get<Worker>("bullmq.worker.default");

        expect(instance).toBeInstanceOf(Worker);
      });

      it.each(config.workerQueues!)("should register worker(%s)", (queue) => {
        const instance = PlatformTest.get<Worker>(`bullmq.worker.${queue}`);

        expect(instance).toBeInstanceOf(Worker);
      });

      it("should not register unspecified worker queue", () => {
        expect(PlatformTest.get("bullmq.worker.bar")).toBeUndefined();
      });

      it("should not allow direct injection of the worker", () => {
        expect(PlatformTest.get(Worker)).not.toBeInstanceOf(Worker);
      });

      it("should run worker and execute processor", async () => {
        const bullMQModule = PlatformTest.get<BullMQModule>(BullMQModule);
        const worker = PlatformTest.get<JobMethods>("bullmq.job.default.regular");
        const job = {
          name: "regular",
          queueName: "default",
          data: {test: "test"}
        };

        vi.spyOn(worker, "handle").mockResolvedValueOnce(undefined as never);

        await (bullMQModule as any).onProcess(job);

        expect(worker.handle).toHaveBeenCalledWith({test: "test"}, job);
      });

      it("should log warning when the worker doesn't exists", async () => {
        const bullMQModule = PlatformTest.get<BullMQModule>(BullMQModule);

        vi.spyOn(PlatformTest.injector.logger, "warn");

        const job = {
          name: "regular",
          queueName: "toto",
          data: {test: "test"}
        };

        await (bullMQModule as any).onProcess(job);

        expect(PlatformTest.injector.logger.warn).toHaveBeenCalledWith({
          event: "BULLMQ_JOB_NOT_FOUND",
          message: "Job regular toto not found"
        });
      });

      it("should run worker, execute processor and handle error", async () => {
        const bullMQModule = PlatformTest.get<BullMQModule>(BullMQModule);
        const worker = PlatformTest.get<JobMethods>("bullmq.job.default.regular");
        const job = {
          name: "regular",
          queueName: "default",
          data: {test: "test"},
          attemptsMade: 1
        };

        vi.spyOn(PlatformTest.injector.logger, "error");

        vi.spyOn(worker, "handle").mockRejectedValue(new Error("error") as never);

        const error = await catchAsyncError(() => (bullMQModule as any).onProcess(job));

        expect(worker.handle).toHaveBeenCalledWith({test: "test"}, job);
        expect(PlatformTest.injector.logger.error).toHaveBeenCalledWith({
          attempt: 1,
          name: "regular",
          queue: "default",
          logType: "bullmq",
          duration: expect.any(Number),
          event: "BULLMQ_JOB_ERROR",
          message: "error",
          reqId: expect.any(String),
          stack: expect.any(String),
          time: expect.any(Object)
        });
        expect(error?.message).toEqual("error");
      });
    });
  });

  describe("with fallback controller", () => {
    beforeEach(async () => {
      @FallbackJobController("foo")
      class FooFallbackController {
        handle() {}
      }

      @FallbackJobController()
      class FallbackController {
        handle() {}
      }

      await PlatformTest.create({
        bullmq: {
          queues: ["default", "foo"],
          connection: {}
        },
        imports: [
          {
            token: JobDispatcher,
            use: instance(dispatcher)
          }
        ]
      });
    });

    it("should run queue specific fallback job controller", async () => {
      const bullMQModule = PlatformTest.get<BullMQModule>(BullMQModule);
      const worker = PlatformTest.get<JobMethods>("bullmq.fallback-job.foo");
      const job = {
        name: "unknown-name",
        queueName: "foo",
        data: {test: "test"}
      };

      vi.spyOn(worker, "handle").mockResolvedValueOnce(undefined as never);

      await (bullMQModule as any).onProcess(job);

      expect(worker.handle).toHaveBeenCalledWith({test: "test"}, job);
    });

    it("should run overall fallback job controller", async () => {
      const bullMQModule = PlatformTest.get<BullMQModule>(BullMQModule);
      const worker = PlatformTest.get<JobMethods>("bullmq.fallback-job");
      const job = {
        name: "unknown-name",
        queueName: "default",
        data: {test: "123"}
      };

      vi.spyOn(worker, "handle").mockResolvedValueOnce(undefined as never);

      await (bullMQModule as any).onProcess(job);

      expect(worker.handle).toHaveBeenCalledWith({test: "123"}, job);
    });
  });
});
