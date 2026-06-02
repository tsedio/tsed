import {MongoBackend} from "@agendajs/mongo-backend";
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
          backend: new MongoBackend({
            address: options.url,
            options: options.connectionOptions as never
          })
        }
      });

      await bstrp();
    });
    afterAll(async () => {
      await PlatformTest.reset();
      await TestContainersMongo.reset();
    });

    it("should have job definitions", () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda.definitions)).toContain("test3");
    });

    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      const {jobs} = await agenda.queryJobs();

      const job2 = jobs.find((job) => job.name.includes("test3"));

      expect(job2?.repeatInterval).toEqual("* * * * *");
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
      expect(agenda.definitions).toBeDefined();
    });
  });
});
