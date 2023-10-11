import {InjectorService} from "@tsed/di";
import {JobDispatcher} from "./JobDispatcher";
import {Job} from "../contracts";
import {AsJob} from "../decorators";
import {Queue} from "bullmq";
import {instance, mock, verify, when, objectContaining} from "ts-mockito";

@AsJob("example-job", "default", {
  backoff: 69
})
class ExampleTestJob implements Job {
  handle(payload: {msg: string}) {}
}

@AsJob("queue-not-configured", "not-configured")
class NotConfiguredQueueTestJob implements Job {
  handle() {}
}

describe("JobDispatcher", () => {
  it("should throw an exception when a queue is not configured", () => {
    const injector = mock(InjectorService);
    when(injector.get("bullmq.queue.default")).thenReturn(undefined);

    const dispatcher = new JobDispatcher(instance(injector));

    expect(dispatcher.dispatch(NotConfiguredQueueTestJob)).rejects.toThrow(new Error("Queue(not-configured) not defined"));
  });

  it("should dispatch job", async () => {
    const injector = mock(InjectorService);
    const queue = mock(Queue);

    when(injector.get("bullmq.queue.default")).thenReturn(instance(queue));

    const dispatcher = new JobDispatcher(instance(injector));

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
});
