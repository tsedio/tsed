import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Pulse, PulseService, Every} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@Pulse()
class TestTwo {
  @Every("* * * * *")
  test3() {
    // test
  }
}

describe("Pulse integration", () => {
  describe("enabled", () => {
    beforeAll(async () => {
      await TestMongooseContext.install();
      const {url} = await TestMongooseContext.getMongooseOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        pulse: {
          enabled: true,
          db: {
            address: url,
            options: {}
          }
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      await TestMongooseContext.reset();
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
      await TestMongooseContext.install();
      const bstrp = PlatformTest.bootstrap(Server, {
        pulse: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterAll(() => TestMongooseContext.reset());

    it("should not have job definitions", () => {
      const pulse = PlatformTest.injector.get(PulseService)!;
      expect(pulse._definitions).toBeUndefined();
    });
  });
});
