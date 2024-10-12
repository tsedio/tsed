import {Injectable} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {OnAny} from "../src/decorators/onAny.js";
import {OnEvent} from "../src/decorators/onEvent.js";
import {EventEmitterModule} from "../src/EventEmitterModule.js";
import {EventEmitterService} from "../src/services/EventEmitterFactory.js";
import {Server} from "./helpers/Server.js";

@Injectable()
class Test {
  @OnEvent("test1")
  test() {
    // test
  }

  @OnEvent("test2", {async: true})
  test2() {
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
    beforeEach(async () => {
      vi.spyOn(Test.prototype, "test").mockReturnValue();
      vi.spyOn(Test.prototype, "test2").mockResolvedValue(23);
      vi.spyOn(TestTwo.prototype, "test3").mockReturnValue();
      vi.spyOn(TestTwo.prototype, "test4").mockReturnValue();
      vi.spyOn(EventEmitterModule.prototype, "printEvents").mockReturnValue();

      const bstrp = PlatformTest.bootstrap(Server, {
        eventEmitter: {
          enabled: true
        }
      });

      await bstrp();
    });
    afterEach(PlatformTest.reset);

    it("should have event definitions", () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      const bla = eventEmitterService.eventNames();
      expect(bla).toEqual(expect.arrayContaining(["test1", "test2"]));
    });

    it("should call methods with event data", () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      expect(eventEmitterService.emit("test1", "test-data")).toBe(true);
      expect(Test.prototype.test).toHaveBeenCalledWith("test-data");
      expect(Test.prototype.test2).not.toHaveBeenCalled();
      expect(TestTwo.prototype.test3).toHaveBeenCalledWith("test-data");
      expect(TestTwo.prototype.test4).toHaveBeenCalledWith("test1", "test-data");
    });

    it("should call async methods and return values", async () => {
      const eventEmitterService = PlatformTest.injector.get<EventEmitterService>(EventEmitterService)!;
      const result = await eventEmitterService.emitAsync("test2");

      expect(result).toHaveLength(2);
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
      expect(eventEmitterService).toEqual({});
    });
  });
});
