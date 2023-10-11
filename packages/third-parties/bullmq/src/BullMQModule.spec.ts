import {PlatformTest} from "@tsed/common";
import {Queue, Worker} from "bullmq";
import {instance, mock, verify, when} from "ts-mockito";
import {type BullMQConfig} from "./config/config";
import {AsJob} from "./decorators";
import {JobDispatcher} from "./dispatchers";
import {Job} from "./contracts";

import "./BullMQModule";

const bullmq = {
  queues: ["default", "foo", "bar"],
  connection: {},
  workerQueues: ["default", "foo"]
} as BullMQConfig;

@AsJob("cron", "default", {
  repeat: {
    pattern: "* * * * *"
  }
})
class CustomCronJob implements Job {
  handle() {}
}

@AsJob("regular", "default")
class RegularJob {}

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
  });
});
