import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {Queue, Worker} from "bullmq";
import {instance, mock, verify, when} from "ts-mockito";

import "./BullMQModule";
import {BullMQModule} from "./BullMQModule";
import {type BullMQConfig} from "./config/config";
import {JobMethods} from "./contracts";
import {Job} from "./decorators";
import {JobDispatcher} from "./dispatchers";

const bullmq = {
  queues: ["default", "foo", "bar"],
  connection: {},
  workerQueues: ["default", "foo"]
} as BullMQConfig;

@Job("cron", "default", {
  repeat: {
    pattern: "* * * * *"
  }
})
class CustomCronJob implements JobMethods {
  handle() {}
}

@Job("regular", "default")
class RegularJob {
  handle() {}
}

describe("module", () => {
  let dispatcher: JobDispatcher;
  beforeEach(async () => {
    dispatcher = mock(JobDispatcher);
    when(dispatcher.dispatch(CustomCronJob)).thenResolve();

    await PlatformTest.create({
      bullmq,
      imports: [
        {
          token: JobDispatcher,
          use: instance(dispatcher)
        }
      ]
    });
  });
  beforeEach(() => {});
  afterEach(PlatformTest.reset);

  describe("cronjobs", () => {
    it("should dispatch cron jobs", () => {
      verify(dispatcher.dispatch(CustomCronJob)).once();
    });
  });

  describe("queues", () => {
    it("should get default", () => {
      const instance = PlatformTest.get<Queue>("bullmq.queue.default");

      expect(instance).toBeInstanceOf(Queue);
      expect(instance.name).toBe("default");
    });

    it.each(bullmq.queues)("should register queue(%s)", (queue) => {
      const instance = PlatformTest.get<Queue>(`bullmq.queue.${queue}`);

      expect(instance).toBeInstanceOf(Queue);
      expect(instance.name).toBe(queue);
    });

    it("should not allow direct injection of the queue", () => {
      expect(PlatformTest.get(Queue)).not.toBeInstanceOf(Queue);
    });
  });

  describe("workers", () => {
    it("should get default", () => {
      const instance = PlatformTest.get<Worker>("bullmq.worker.default");

      expect(instance).toBeInstanceOf(Worker);
      expect(instance.name).toBe("default");
    });

    it.each(bullmq.workerQueues)("should register worker(%s)", (queue) => {
      const instance = PlatformTest.get<Worker>(`bullmq.worker.${queue}`);

      expect(instance).toBeInstanceOf(Worker);
      expect(instance.name).toBe(queue);
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

      jest.spyOn(worker, "handle").mockResolvedValueOnce(undefined as never);

      await (bullMQModule as any).onProcess(job);

      expect(worker.handle).toHaveBeenCalledWith({test: "test"}, job);
    });

    it("should log warning when the worker doesn't exists", async () => {
      const bullMQModule = PlatformTest.get<BullMQModule>(BullMQModule);

      jest.spyOn(PlatformTest.injector.logger, "warn");

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
        data: {test: "test"}
      };

      jest.spyOn(PlatformTest.injector.logger, "error");

      jest.spyOn(worker, "handle").mockRejectedValue(new Error("error") as never);

      const error = await catchAsyncError(() => (bullMQModule as any).onProcess(job));

      expect(worker.handle).toHaveBeenCalledWith({test: "test"}, job);
      expect(PlatformTest.injector.logger.error).toHaveBeenCalledWith({
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
