import {DITest, inject, injectable, injector} from "@tsed/di";
import {JobController} from "../decorators/index.js";
import {JobDispatcher} from "./JobDispatcher.js";
import {JobMethods} from "../contracts/index.js";
import {beforeEach} from "vitest";
import {catchAsyncError} from "@tsed/core";

@JobController("example-job-with-custom-id-from-job-methods")
class ExampleJobWithCustomJobIdFromJobMethods implements JobMethods {
  handle(payload: string) {}

  jobId(payload: string): string {
    return payload.toUpperCase();
  }
}

@JobController("example-job", "default", {
  backoff: 69
})
class ExampleTestJob implements JobMethods {
  handle(payload: {msg: string}) {}
}

@JobController("example-cron", "default", {
  attempts: 3,
  repeat: {pattern: "* * * * *"}
})
class ExampleCronJob implements JobMethods {
  handle(payload?: {msg: string}) {}
}

@JobController("queue-not-configured", "not-configured")
class NotConfiguredQueueTestJob implements JobMethods {
  handle() {}
}

function getFixture() {
  const dispatcher = inject(JobDispatcher);
  const queue = {
    name: "default",
    add: vi.fn(),
    upsertJobScheduler: vi.fn()
  };

  const specialQueue = {
    name: "special",
    add: vi.fn()
  };

  injectable("bullmq.queue.default").value(queue);
  injectable("bullmq.queue.special").value(specialQueue);
  injectable("bullmq.job.default.example-job").value(new ExampleTestJob());
  injectable("bullmq.job.default.example-cron").value(new ExampleCronJob());
  injectable("bullmq.job.default.example-job-with-custom-id-from-job-methods").value(new ExampleJobWithCustomJobIdFromJobMethods());

  vi.spyOn(injector(), "resolve");

  return {
    dispatcher,
    queue,
    specialQueue,
    job: inject<ExampleJobWithCustomJobIdFromJobMethods>("bullmq.job.default.example-job-with-custom-id-from-job-methods")
  };
}

describe("JobDispatcher", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should throw an exception when a queue is not configured", async () => {
    const {dispatcher} = getFixture();

    const error = await catchAsyncError(() => dispatcher.dispatch(NotConfiguredQueueTestJob));

    await expect(error).toEqual(new Error("Queue(not-configured) not defined"));

    expect(injector().resolve).toHaveBeenCalledWith("bullmq.queue.not-configured", expect.anything());
  });
  it("should dispatch job as type", async () => {
    const {dispatcher, queue} = getFixture();

    await dispatcher.dispatch(ExampleTestJob, {msg: "hello test"});

    expect(queue.add).toHaveBeenCalledOnce();
    expect(queue.add).toHaveBeenCalledWith(
      "example-job",
      expect.objectContaining({msg: "hello test"}),
      expect.objectContaining({backoff: 69})
    );
  });
  it("should dispatch job as options", async () => {
    const {dispatcher, specialQueue} = getFixture();

    await dispatcher.dispatch(
      {
        queue: "special",
        name: "some-name"
      },
      {msg: "hello test"}
    );

    expect(specialQueue.add).toHaveBeenCalledOnce();
    expect(specialQueue.add).toHaveBeenCalledWith("some-name", expect.objectContaining({msg: "hello test"}), expect.anything());
  });
  it("should dispatch job as string", async () => {
    const {dispatcher, queue} = getFixture();

    await dispatcher.dispatch("some-name", {msg: "hello test"});

    expect(queue.add).toHaveBeenCalledOnce();
    expect(queue.add).toHaveBeenCalledWith("some-name", expect.objectContaining({msg: "hello test"}), expect.anything());
  });
  it("should overwrite job options defined by the job", async () => {
    const {dispatcher, queue} = getFixture();

    await dispatcher.dispatch(ExampleTestJob, {msg: "hello test"}, {backoff: 42, jobId: "ffeeaa"});

    expect(queue.add).toHaveBeenCalledOnce();
    expect(queue.add).toHaveBeenCalledWith(
      "example-job",
      expect.objectContaining({msg: "hello test"}),
      expect.objectContaining({backoff: 42, jobId: "ffeeaa"})
    );
  });
  it("should keep existing options and add new ones", async () => {
    const {dispatcher, queue} = getFixture();

    await dispatcher.dispatch(ExampleTestJob, {msg: "hello test"}, {jobId: "ffeeaa"});

    expect(queue.add).toHaveBeenCalledOnce();
    expect(queue.add).toHaveBeenCalledWith(
      "example-job",
      expect.objectContaining({msg: "hello test"}),
      expect.objectContaining({backoff: 69, jobId: "ffeeaa"})
    );
  });
  describe("repeating jobs", () => {
    it("should register a repeating job through a job scheduler", async () => {
      const {dispatcher, queue} = getFixture();

      await dispatcher.dispatch(ExampleCronJob);

      expect(queue.add).not.toHaveBeenCalled();
      expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
        "example-cron",
        {pattern: "* * * * *"},
        {name: "example-cron", data: undefined, opts: {attempts: 3}}
      );
    });
    it("should use the jobId as job scheduler id", async () => {
      const {dispatcher, queue} = getFixture();

      await dispatcher.dispatch(ExampleCronJob, {msg: "hello"}, {jobId: "custom-id"});

      expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
        "custom-id",
        {pattern: "* * * * *"},
        {name: "example-cron", data: {msg: "hello"}, opts: {attempts: 3}}
      );
    });
    it("should register distinct job schedulers when the repeat options are given at dispatch time", async () => {
      const {dispatcher, queue} = getFixture();

      await dispatcher.dispatch(ExampleCronJob, undefined, {repeat: {pattern: "0 * * * *"}});
      await dispatcher.dispatch(ExampleCronJob, undefined, {repeat: {every: 1000}});
      await dispatcher.dispatch("some-name", undefined, {repeat: {pattern: "0 0 * * *", tz: "Europe/Paris"}});

      expect(queue.upsertJobScheduler.mock.calls.map(([id]) => id)).toEqual([
        "example-cron:0 * * * *",
        "example-cron:1000",
        "some-name:0 0 * * *:Europe/Paris"
      ]);
    });
    it("should remove the legacy repeatable job before registering the job scheduler (bullmq v5)", async () => {
      const {dispatcher, queue} = getFixture();
      const removeRepeatable = vi.fn().mockResolvedValue(true);

      Object.assign(queue, {removeRepeatable});

      await dispatcher.dispatch(ExampleCronJob, undefined, {jobId: "custom-id"});

      expect(removeRepeatable).toHaveBeenCalledWith("example-cron", {pattern: "* * * * *"}, "custom-id");
      expect(removeRepeatable.mock.invocationCallOrder[0]).toBeLessThan(queue.upsertJobScheduler.mock.invocationCallOrder[0]);
    });
  });
  describe("custom jobId", () => {
    it("should allow setting the job id from within the job", async () => {
      const {dispatcher, queue} = getFixture();

      await dispatcher.dispatch(ExampleJobWithCustomJobIdFromJobMethods, "hello world");

      expect(queue.add).toHaveBeenCalledOnce();
      expect(queue.add).toHaveBeenCalledWith("example-job-with-custom-id-from-job-methods", "hello world", expect.anything());

      const [, , opts] = queue.add.mock.calls.at(-1)!;

      expect(opts).toMatchObject({
        jobId: "HELLO WORLD"
      });
    });

    it("should pass the payload to the jobId method", async () => {
      const {dispatcher, job} = getFixture();

      vi.spyOn(job, "jobId");

      await dispatcher.dispatch(ExampleJobWithCustomJobIdFromJobMethods, "hello world");

      expect(job.jobId).toHaveBeenCalledOnce();
      expect(job.jobId).toHaveBeenCalledWith("hello world");
    });

    it("should choose the jobId provided to the dispatcher even when the method is implemented", async () => {
      const {dispatcher, queue} = getFixture();

      await dispatcher.dispatch(ExampleJobWithCustomJobIdFromJobMethods, "hello world", {
        jobId: "I don't think so"
      });

      const [, , opts] = queue.add.mock.calls.at(-1)!;

      expect(opts).toMatchObject({
        jobId: "I don't think so"
      });
    });
  });
});
