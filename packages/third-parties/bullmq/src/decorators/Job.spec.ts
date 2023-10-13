import {Job} from "./Job";
import {Store} from "@tsed/core";

describe("Job", () => {
  it("should set the proper store data", () => {
    @Job("testjob")
    class TestJob {}

    const store = Store.from(TestJob).get("bullmq");

    expect(store.name).toBe("testjob");
    expect(store.queue).toBe("default");
    expect(store.opts).toStrictEqual({});
  });

  it("should allow settings a custom queue", () => {
    @Job("testjob", "custom")
    class CustomQueueJob {}

    const store = Store.from(CustomQueueJob).get("bullmq");

    expect(store.queue).toBe("custom");
  });

  it("should allow custom options to be set", () => {
    @Job("testjob", "default", {
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
    @Job("testjob", "default", {
      repeat: {count: 42}
    })
    class CustomCronJob {}

    const store = Store.from(CustomCronJob).get("bullmq");

    expect(store);
  });
});
