import {PlatformTest} from "@tsed/common";
import {Inject} from "@tsed/di";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Job} from "@pulsecron/pulse";
import {PulseModule, Pulse, PulseService, Define} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@Pulse({namespace: "test-nsp"})
class Test {
  @Inject()
  pulse: PulseModule;

  jobs: Job[];

  @Define({name: "customName"})
  test2(job: Job) {
    // test
    expect(job.attrs.data.locale).toBeDefined();
  }

  $beforePulseStart() {
    const locales = ["fr-FR", "en-US"];

    this.jobs = locales.map((locale) => {
      return this.pulse.create("customName", {
        locale
      });
    });
  }

  $afterPulseStart() {
    return Promise.all(this.jobs.map((job) => job.repeatEvery("1 week").save()));
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
      expect(Object.keys(pulse._definitions)).toEqual(["test-nsp.test", "test-nsp.customName"]);
    });

    it("should schedule cron-like jobs", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      const jobs = await pulse.jobs();

      const job1 = jobs.find((job: any) => job.attrs.name.includes("test-nsp.test"));

      expect(job1?.attrs.repeatInterval).toEqual("1 week");
    });

    it("should schedule defined job and run it", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;

      const job = await pulse.now("test-nsp.customName", {});
      const runnedJob = await pulse.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs._id).toStrictEqual(job.attrs._id);
      expect(runnedJob[0].attrs.lastRunAt).toBeDefined();
      expect(runnedJob[0].attrs.data.locale).toEqual("fr-FR");
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

    it("should fail to schedule a job", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;
      await expect(() => pulse.now("test-nsp.customName", {})).rejects.toThrowError(TypeError);
    });
  });

  describe("enabled but job processing is disabled", () => {
    beforeAll(async () => {
      await TestMongooseContext.install();
      const {url} = await TestMongooseContext.getMongooseOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        pulse: {
          enabled: true,
          disableJobProcessing: true,
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
