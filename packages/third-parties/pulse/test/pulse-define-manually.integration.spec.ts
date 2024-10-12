import {Job} from "@pulsecron/pulse";
import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {Define, Pulse, PulseModule, PulseService} from "../src/index.js";
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
      expect(Object.keys(pulse._definitions)).toEqual(["test-nsp.customName"]);
    });

    it("should schedule defined job and run it", async () => {
      const pulse = PlatformTest.get<PulseService>(PulseService)!;

      const job = await pulse.now("test-nsp.customName", {
        locale: "fr-FR"
      });
      const runnedJob = await pulse.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs._id).toStrictEqual(job.attrs._id);
      expect(runnedJob[0].attrs.data.locale).toEqual("fr-FR");
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
