import {Pulse} from "@pulsecron/pulse";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {Every, JobsController, PulseService} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@JobsController()
class TestTwo {
  @Every("* * * * *")
  test3() {
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
      expect(Object.keys(pulse._definitions)).toContain("test3");
    });

    it("should schedule cron-like jobs", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      const jobs = await pulse.jobs();

      const job2 = jobs.find((job: any) => job.attrs.name.includes("test3"));

      expect(job2?.attrs.repeatInterval).toEqual("* * * * *");
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

    it("should have job definitions thanks to Proxy", () => {
      const pulse = PlatformTest.injector.get(Pulse)!;
      expect(pulse._definitions).toBeDefined();
    });
  });
});
