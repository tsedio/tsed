import {JobController} from "./JobController";
import {Store} from "@tsed/core";

describe("JobController", () => {
  it("should set the proper store data", () => {
    @JobController("testjob")
    class TestJob {}

    const store = Store.from(TestJob).get("bullmq");

    expect(store.name).toBe("testjob");
    expect(store.queue).toBe("default");
    expect(store.opts).toStrictEqual({});
  });

  it("should allow settings a custom queue", () => {
    @JobController("testjob", "custom")
    class CustomQueueJob {}

    const store = Store.from(CustomQueueJob).get("bullmq");

    expect(store.queue).toBe("custom");
  });

  it("should allow custom options to be set", () => {
    @JobController("testjob", "default", {
      backoff: 69,
      attempts: 42
    })
    class CustomOptionsJob {}

    const store = Store.from(CustomOptionsJob).get("bullmq");

    expect(store.opts).toStrictEqual({
      backoff: 69,
      attempts: 42
    });
  });

  it("should set type for cron jobs", () => {
    @JobController("testjob", "default", {
      repeat: {count: 42}
    })
    class CustomCronJob {}

    const store = Store.from(CustomCronJob).get("bullmq");

    expect(store);
  });
});
