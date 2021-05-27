import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Agenda, AgendaService, Every, Define} from "../src/";
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
            address: url
          }
        }
      });
  
      await bstrp();
    });
    afterEach(TestMongooseContext.reset);
  
    it("should have job definitions", async () => {
      const agenda = PlatformTest.injector.get<AgendaService>(AgendaService)!;
      expect(agenda._definitions).to.contain.keys("test-nsp.test", "test-nsp.customName", "test3");
    });
  
    it("should schedule cron-like jobs", async () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      const jobs = await agenda.jobs();
  
      expect(jobs).to.have.length(4);
      expect(jobs[0].attrs.name).to.be.deep.eq("test-nsp.test");
      expect(jobs[0].attrs.repeatInterval).to.be.eq("60 seconds");
  
      expect(jobs[1].attrs.name).to.be.deep.eq("test3");
      expect(jobs[1].attrs.repeatInterval).to.be.eq("* * * * *");
    });
  })
  
  describe("disabled", () => {

    beforeEach(async () => {
      await TestMongooseContext.install();
      const {url} = await TestMongooseContext.getMongooseOptions();
      const bstrp = PlatformTest.bootstrap(Server, {
        agenda: {
          db: {
            address: url
          }
        }
      });
  
      await bstrp();
    });
    afterEach(TestMongooseContext.reset);

    it("should not have job definitions", async () => {
      const agenda = PlatformTest.injector.get(AgendaService)!;
      expect(agenda._definitions).to.be.empty
    });

  });

});
