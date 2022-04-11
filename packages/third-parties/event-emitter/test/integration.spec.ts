import {expect} from "chai";
import Sinon from "sinon";
import {Injectable, PlatformTest} from "@tsed/common";
import {Server} from "./helpers/Server";
import {OnEvent} from "../src/decorators/onEvent";
import {EventEmitterService} from "../src/services/EventEmitterFactory";
import {OnAny} from "../src/decorators/onAny";
import {EventEmitterModule} from "../src/EventEmitterModule";

@Injectable()
class Test {
  @OnEvent("test1")
  test() {
    // test
  }

  @OnEvent("test2", {async: true})
  async test2() {
    return Promise.resolve(23);
  }
}

@Injectable()
class TestTwo {
  @OnEvent("test1")
  test3() {
    // test
  }

  @OnAny()
  test4() {
    // test
  }
}

describe("EventEmitter integration", () => {
  describe("enabled", () => {
    let testTestSpy: Sinon.SinonSpy;
    let testTest2Spy: Sinon.SinonSpy;
    let testTwoTest3Spy: Sinon.SinonSpy;
    let testTwoTest4Spy: Sinon.SinonSpy;

    let printEventsSpy: Sinon.SinonSpy;

    beforeEach(async () => {
      testTestSpy = Sinon.spy(Test.prototype, "test");
      testTest2Spy = Sinon.spy(Test.prototype, "test2");
      testTwoTest3Spy = Sinon.spy(TestTwo.prototype, "test3");
      testTwoTest4Spy = Sinon.spy(TestTwo.prototype, "test4");

      printEventsSpy = Sinon.spy(EventEmitterModule.prototype, "printEvents");

      const bstrp = PlatformTest.bootstrap(Server, {
        eventEmitter: {
          enabled: true
        }
      });

      await bstrp();
    });
    afterEach(() => {
      testTestSpy.restore();
      testTest2Spy.restore();
      testTwoTest3Spy.restore();
      testTwoTest4Spy.restore();
      printEventsSpy.restore();
    });
    afterEach(PlatformTest.reset);

    it("should have event definitions", () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      const bla = eventEmitterService.eventNames();
      expect(bla).to.contain("test1", "test2");
    });

    it("should call methods with event data", () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      expect(eventEmitterService.emit("test1", "test-data")).to.be.true;

      expect(testTestSpy.calledOnceWith("test-data")).to.be.true;
      expect(testTest2Spy.notCalled).to.be.true;
      expect(testTwoTest3Spy.calledOnceWith("test-data")).to.be.true;
      expect(testTwoTest4Spy.calledOnceWith("test1", "test-data")).to.be.true;
    });

    it("should call async methods and return values", async () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      const result = await eventEmitterService.emitAsync("test2");
      expect(result).to.length(2);
    });
  });

  describe("disabled", () => {
    beforeEach(async () => {
      const bstrp = PlatformTest.bootstrap(Server, {
        eventEmitter: {
          enabled: false
        }
      });

      await bstrp();
    });
    afterEach(PlatformTest.reset);

    it("service is not available", () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      expect(eventEmitterService).to.deep.eq({});
    });
  });
});
