import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Agenda, AgendaService, Define, Every} from "@tsed/agenda";
import {Server} from "./helpers/Server";

@Agenda({namespace: "test-nsp"})
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
      await TestMongooseContext.install();
      const {url} = await TestMongooseContext.getMongooseOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
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
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      await TestMongooseContext.reset();
      await agenda._db.close();
    });

    it("should have job definitions", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      expect(Object.keys(agenda._definitions)).toEqual(["test-nsp.test", "test-nsp.customName"]);
    });

    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.get<AgendaService>(AgendaService)!;
      const jobs = await agenda.jobs();

      const job1 = jobs.find((job: any) => job.attrs.name.includes("test-nsp.test"));

      expect(job1?.attrs.repeatInterval).toEqual("60 seconds");
    });
  });

  describe("disabled", () => {
    beforeAll(async () => {
      await TestMongooseContext.install();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterAll(() => TestMongooseContext.reset());

    it("should not have job definitions", async () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      expect(agenda._definitions).toBeUndefined();
    });
  });
});
