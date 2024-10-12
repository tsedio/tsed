import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {Define, Every, Pulse, PulseService} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@Pulse({namespace: "test-nsp"})
class Test {
  @Every("60 seconds")
  test() {
    // test
  }

  @Define({name: "customName"})
  test2() {
    // test
  }
}

describe("Pulse integration", () => {
  describe("enabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        pulse: {
          enabled: true,
          db: {
            address: options.url,
            options: options.connectionOptions as never
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      await TestContainersMongo.reset();
      await pulse._db.close();
    });

    it("should have job definitions", () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      expect(Object.keys(pulse._definitions)).toEqual(["test-nsp.test", "test-nsp.customName"]);
    });

    it("should schedule cron-like jobs", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      const jobs = await pulse.jobs();

      const job1 = jobs.find((job: any) => job.attrs.name.includes("test-nsp.test"));

      expect(job1?.attrs.repeatInterval).toEqual("60 seconds");
    });

    it("should schedule defined job and run it", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;

      const job = await pulse.now("test-nsp.customName", {});
      const runnedJob = await pulse.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs._id).toStrictEqual(job.attrs._id);
      expect(runnedJob[0].attrs.nextRunAt).toBeDefined();
    });
  });

  describe("disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        pulse: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterAll(() => TestContainersMongo.reset());

    it("should not have job definitions", () => {
      const pulse = PlatformTest.injector.get(PulseService)!;
      expect(pulse._definitions).toBeUndefined();
    });
  });

  describe("enabled but job processing is disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        pulse: {
          enabled: true,
          disableJobProcessing: true,
          db: {
            address: options.url,
            options: options.connectionOptions as never
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      await TestContainersMongo.reset();
      await pulse._db.close();
    });

    it("should not have job definitions", () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      expect(Object.keys(pulse._definitions)).toEqual([]);
    });

    it("should schedule job but not run it", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;

      const job = await pulse.now("test-nsp.customName", {});
      const runnedJob = await pulse.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs.lastRunAt).toBeUndefined();
    });
  });
});
