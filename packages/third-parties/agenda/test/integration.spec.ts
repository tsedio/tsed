import {expect} from "chai";
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

@Agenda()
class TestTwo {
  @Every("* * * * *")
  test3() {
    // test
  }
}

describe("Agenda integration", () => {
  describe("enabled", () => {
    beforeEach(async () => {
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
    afterEach(async () => {
      const agenda = PlatformTest.injector.get<AgendaService>(AgendaService)!;
      await TestMongooseContext.reset();
      await agenda._db.close();
    });

    it("should have job definitions", async () => {
      const agenda = PlatformTest.injector.get<AgendaService>(AgendaService)!;
      expect(agenda._definitions).to.contain.keys("test-nsp.test", "test-nsp.customName", "test3");
    });

    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      const jobs = await agenda.jobs();

      const job1 = jobs.find((job: any) => job.attrs.name === "test-nsp.test");
      const job2 = jobs.find((job: any) => job.attrs.name === "test3");

      expect(job1.attrs.repeatInterval).to.be.eq("60 seconds");
      expect(job2.attrs.repeatInterval).to.be.eq("* * * * *");
    });
  });

  describe("disabled", () => {
    beforeEach(async () => {
      await TestMongooseContext.install();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterEach(() => TestMongooseContext.reset());

    it("should not have job definitions", async () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      expect(agenda._definitions).to.eq(undefined);
    });
  });
});
