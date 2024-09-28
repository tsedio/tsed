import {InjectorService} from "@tsed/di";
import {Queue} from "bullmq";
import {anything, capture, instance, mock, objectContaining, spy, verify, when} from "ts-mockito";

import {JobMethods} from "../contracts/index.js";
import {JobController} from "../decorators/index.js";
import {JobDispatcher} from "./JobDispatcher.js";

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

@JobController("queue-not-configured", "not-configured")
class NotConfiguredQueueTestJob implements JobMethods {
  handle() {}
}

describe("JobDispatcher", () => {
  let injector: InjectorService;
  let queue: Queue;
  let dispatcher: JobDispatcher;
  beforeEach(() => {
    injector = mock(InjectorService);
    queue = mock(Queue);
    when(queue.name).thenReturn("default");
    when(injector.get("bullmq.queue.default")).thenReturn(instance(queue));
    when(injector.get("bullmq.job.default.example-job")).thenReturn(new ExampleTestJob());

    dispatcher = new JobDispatcher(instance(injector));
  });

  it("should throw an exception when a queue is not configured", async () => {
    when(injector.get("bullmq.queue.not-configured")).thenReturn(undefined);

    await expect(dispatcher.dispatch(NotConfiguredQueueTestJob)).rejects.toThrow(new Error("Queue(not-configured) not defined"));
    verify(injector.get("bullmq.queue.not-configured")).once();
  });

  it("should dispatch job as type", async () => {
    await dispatcher.dispatch(ExampleTestJob, {msg: "hello test"});

    verify(
      queue.add(
        "example-job",
        objectContaining({msg: "hello test"}),
        objectContaining({
          backoff: 69
        })
      )
    ).once();
  });

  it("should dispatch job as options", async () => {
    const specialQueue = mock(Queue);
    when(specialQueue.name).thenReturn("special");
    when(injector.get("bullmq.queue.special")).thenReturn(instance(specialQueue));

    await dispatcher.dispatch(
      {
        queue: "special",
        name: "some-name"
      },
      {msg: "hello test"}
    );

    verify(specialQueue.add("some-name", objectContaining({msg: "hello test"}), objectContaining({}))).once();
  });

  it("should dispatch job as string", async () => {
    await dispatcher.dispatch("some-name", {msg: "hello test"});

    verify(queue.add("some-name", objectContaining({msg: "hello test"}), objectContaining({}))).once();
  });

  it("should overwrite job options defined by the job", async () => {
    await dispatcher.dispatch(ExampleTestJob, {msg: "hello test"}, {backoff: 42, jobId: "ffeeaa"});

    verify(
      queue.add(
        "example-job",
        objectContaining({msg: "hello test"}),
        objectContaining({
          backoff: 42,
          jobId: "ffeeaa"
        })
      )
    ).once();
  });

  it("should keep existing options and add new ones", async () => {
    await dispatcher.dispatch(ExampleTestJob, {msg: "hello test"}, {jobId: "ffeeaa"});

    verify(
      queue.add(
        "example-job",
        objectContaining({msg: "hello test"}),
        objectContaining({
          backoff: 69,
          jobId: "ffeeaa"
        })
      )
    ).once();
  });

  describe("custom jobId", () => {
    let job: ExampleJobWithCustomJobIdFromJobMethods;
    beforeEach(() => {
      job = new ExampleJobWithCustomJobIdFromJobMethods();
      when(injector.get("bullmq.job.default.example-job-with-custom-id-from-job-methods")).thenReturn(job);
    });

    it("should allow setting the job id from within the job", async () => {
      await dispatcher.dispatch(ExampleJobWithCustomJobIdFromJobMethods, "hello world");

      verify(queue.add("example-job-with-custom-id-from-job-methods", "hello world", anything())).once();

      const [, , opts] = capture(queue.add).last();
      expect(opts).toMatchObject({
        jobId: "HELLO WORLD"
      });
    });

    it("should pass the payload to the jobId method", async () => {
      const spyJob = spy(job);
      await dispatcher.dispatch(ExampleJobWithCustomJobIdFromJobMethods, "hello world");

      verify(spyJob.jobId("hello world")).once();
    });

    it("should choose the jobId provided to the dispatcher even when the method is implemented", async () => {
      await dispatcher.dispatch(ExampleJobWithCustomJobIdFromJobMethods, "hello world", {
        jobId: "I don't think so"
      });

      const [, , opts] = capture(queue.add).last();
      expect(opts).toMatchObject({
        jobId: "I don't think so"
      });
    });
  });
});
