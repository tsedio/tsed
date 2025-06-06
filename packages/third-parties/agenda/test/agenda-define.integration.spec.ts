import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import {Agenda} from "agenda";

import {AgendaService, Define, Every, JobsController} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@JobsController({namespace: "test-nsp"})
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

describe("Agenda integration", () => {
  describe("enabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
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
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestContainersMongo.reset();
      await agenda._db.close();
    });

    it("should have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda._definitions)).toEqual(["test-nsp.test", "test-nsp.customName"]);
    });

    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      const jobs = await agenda.jobs();

      const job1 = jobs.find((job: any) => job.attrs.name.includes("test-nsp.test"));

      expect(job1?.attrs.repeatInterval).toEqual("60 seconds");
    });

    it("should schedule defined job and run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {});
      const runnedJob = await agenda.jobs({_id: job.attrs._id});

      expect(runnedJob[0].attrs._id).toStrictEqual(job.attrs._id);
      expect(runnedJob[0].attrs.nextRunAt).toBeDefined();
    });
  });

  describe("disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: false as never
      });

      await bstrp();
    });
    afterAll(() => TestContainersMongo.reset());

    it("should have job definitions thanks to Proxy", () => {
      const agenda = PlatformTest.injector.get(Agenda)!;
      expect(agenda._definitions).toBeDefined();
    });
  });

  describe("enabled but job processing is disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();

      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
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
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestContainersMongo.reset();
      await agenda._db.close();
    });

    it("should not have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda._definitions)).toEqual([]);
    });

    it("should schedule job but not run it", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;

      const job = await agenda.now("test-nsp.customName", {});
      const runnedJob = await agenda.jobs({_id: job.attrs._id});
      expect(runnedJob[0].attrs.lastRunAt).toBeUndefined();
    });
  });
});
