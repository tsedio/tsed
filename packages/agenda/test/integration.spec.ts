import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Agenda} from "agenda";
import {expect} from "chai";
import {Agenda as AgendaDecorator, Every, Define} from "../src/";
import {Server} from "./helpers/Server";

@AgendaDecorator({namespace: "test-nsp"})
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

@AgendaDecorator()
class TestTwo {
  @Every("* * * * *")
  test3() {
    // test
  }
}

describe("Agenda integration", () => {
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

  it("should have job definitions", async () => {
    const agenda = PlatformTest.injector.get<Agenda>(Agenda)!;
    expect(agenda._definitions).to.contain.keys("test-nsp.test", "test-nsp.customName", "test3");
  });

  it("should schedule cron-like jobs", async () => {
    const agenda = PlatformTest.injector.get<Agenda>(Agenda)!;
    await agenda.start();
    const jobs = await agenda.jobs();
    await agenda.stop();

    expect(jobs).to.have.length(4); 
    expect(jobs[0].attrs.name).to.be.deep.eq("test-nsp.test");
    expect(jobs[0].attrs.repeatInterval).to.be.eq("60 seconds");

    expect(jobs[1].attrs.name).to.be.deep.eq("test3");
    expect(jobs[1].attrs.repeatInterval).to.be.eq("* * * * *");
  });


});
