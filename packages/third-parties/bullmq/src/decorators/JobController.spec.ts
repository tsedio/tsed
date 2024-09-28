import {Store} from "@tsed/core";
import {GlobalProviders} from "@tsed/di";

import {FallbackJobController, JobController} from "./JobController.js";

describe("JobController", () => {
  afterEach(() => GlobalProviders.clear());

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

    expect(store).toBeDefined();
  });
});

describe("FallbackJobController", () => {
  afterEach(() => GlobalProviders.clear());

  describe("with queue", () => {
    it("should set the proper store data", () => {
      @FallbackJobController("default")
      class FallbackJob {}

      const store = Store.from(FallbackJob).get("bullmq");
      expect(store.queue).toBe("default");

      const fallbackControllerForQueue = GlobalProviders.get("bullmq.fallback-job.default");
      expect(fallbackControllerForQueue).not.toBeUndefined();
      expect(fallbackControllerForQueue?.type).toEqual("bullmq:fallback-job");
      expect(fallbackControllerForQueue?.useClass).toEqual(FallbackJob);

      const fallbackController = GlobalProviders.get("bullmq.fallback-job");
      expect(fallbackController).toBeUndefined();
    });
  });

  describe("without queue", () => {
    it("should set the proper store data", () => {
      @FallbackJobController()
      class FallbackJob {}

      const store = Store.from(FallbackJob).get("bullmq");
      expect(store.queue).toBeUndefined();

      const fallbackController = GlobalProviders.get("bullmq.fallback-job");
      expect(fallbackController).not.toBeUndefined();
      expect(fallbackController?.type).toEqual("bullmq:fallback-job");
      expect(fallbackController?.useClass).toEqual(FallbackJob);

      const fallbackControllerForQueue = GlobalProviders.get("bullmq.fallback-job.default");
      expect(fallbackControllerForQueue).toBeUndefined();
    });
  });
});
