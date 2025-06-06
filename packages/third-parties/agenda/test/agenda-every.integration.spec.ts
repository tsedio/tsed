import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import {Agenda} from "agenda";

import {AgendaService, Every, JobsController} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@JobsController()
class TestTwo {
  @Every("* * * * *")
  test3() {
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
      expect(Object.keys(agenda._definitions)).toContain("test3");
    });

    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      const jobs = await agenda.jobs();

      const job2 = jobs.find((job: any) => job.attrs.name.includes("test3"));

      expect(job2?.attrs.repeatInterval).toEqual("* * * * *");
    });
  });

  describe("disabled", () => {
    beforeAll(async () => {
      const options = TestContainersMongo.getMongoConnectionOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        mongoose: [options],
        agenda: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterAll(() => TestContainersMongo.reset());

    it("should have job definitions thanks to Proxy", () => {
      const agenda = PlatformTest.injector.get(Agenda)!;
      expect(agenda._definitions).toBeDefined();
    });
  });
});
