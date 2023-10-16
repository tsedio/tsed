import {InjectorService} from "@tsed/di";
import {JobDispatcher} from "./JobDispatcher";
import {JobMethods} from "../contracts";
import {JobController} from "../decorators";
import {Queue} from "bullmq";
import {instance, mock, verify, when, objectContaining} from "ts-mockito";

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
  it("should throw an exception when a queue is not configured", () => {
    const injector = mock(InjectorService);
    when(injector.getMany("bullmq:queue")).thenReturn([]);

    const dispatcher = new JobDispatcher(instance(injector));

    expect(dispatcher.dispatch(NotConfiguredQueueTestJob)).rejects.toThrow(new Error("Queue(not-configured) not defined"));
    verify(injector.getMany("bullmq:queue")).once();
  });

  it("should dispatch job", async () => {
    const injector = mock(InjectorService);
    const queue = mock(Queue);
    when(queue.name).thenReturn("default");

    when(injector.getMany("bullmq:queue")).thenReturn([instance(queue)]);

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
