import {Logger} from "@tsed/logger";
import {beforeEach} from "vitest";

import {DITest} from "../../node/index.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {InjectorService} from "../services/InjectorService.js";
import {AutoInjectable} from "./autoInjectable.js";
import {Inject} from "./inject.js";
import {Injectable} from "./injectable.js";

const TOKEN_GROUPS = Symbol.for("groups:1");

interface InterfaceGroup {
  type: string;
}

@Injectable({
  type: TOKEN_GROUPS
})
class MyService1 implements InterfaceGroup {
  readonly type: string = "service1";

  constructor(@Inject(InjectorService) readonly injector: any) {}
}

@Injectable({
  type: TOKEN_GROUPS
})
class MyService2 implements InterfaceGroup {
  readonly type: string = "service2";

  constructor(@Inject(InjectorService) readonly injector: any) {}
}

const TokenAsync = Symbol.for("MyService2");

registerProvider({
  provide: TokenAsync,
  type: TOKEN_GROUPS,
  deps: [],
  useAsyncFactory() {
    return Promise.resolve({
      type: "async"
    });
  }
});

describe("AutoInjectable", () => {
  describe("when the instance is created during an injection context", () => {
    beforeEach(() => DITest.create());
    afterEach(() => DITest.reset());
    it("should return a class that extends the original class", () => {
      @AutoInjectable()
      class Test {
        @Inject(Logger)
        logger: Logger;

        foo() {
          this.logger.info("test");
        }
      }

      const test = new Test();
      const test2 = new Test();

      expect(test).toBeInstanceOf(Test);
      expect(test2).toBeInstanceOf(Test);
      expect(test).not.toBe(test2);

      vi.spyOn(test.logger, "info").mockResolvedValue(undefined as never);

      test.foo();

      expect(test.logger.info).toHaveBeenCalledWith("test");
    });
    it("should return a class that extends the original class (with additional args)", () => {
      @AutoInjectable()
      class Test {
        @Inject(Logger)
        logger: Logger;

        private value: string;

        constructor(initialValue: string, @Inject(InjectorService) injector?: InjectorService) {
          this.value = initialValue;
          expect(injector).toBeInstanceOf(InjectorService);
        }

        foo() {
          this.logger.info("test_" + this.value);
        }
      }

      const test = new Test("test");

      vi.spyOn(test.logger, "info").mockResolvedValue(undefined as never);

      test.foo();

      expect(test.logger.info).toHaveBeenCalledWith("test_test");
    });
    it("should return a class that extends the original class (with inject many)", () => {
      @AutoInjectable()
      class Test {
        @Inject(Logger)
        logger: Logger;
        instances?: InterfaceGroup[];
        private value: string;

        constructor(initialValue: string, @Inject(TOKEN_GROUPS) instances?: InterfaceGroup[]) {
          this.value = initialValue;
          this.instances = instances;
        }
      }

      expect(new Test("test").instances).toHaveLength(3);
    });
    it("should return a class that extends the original class (with 3 arguments)", () => {
      @AutoInjectable()
      class Test {
        constructor(
          public items: string[],
          public group: string,
          @Inject() logger?: Logger
        ) {
          expect(items).toEqual(["item1", "item2", "item3"]);
          expect(group).toBe("group");
          expect(logger).toBeInstanceOf(Logger);
        }
      }

      new Test(["item1", "item2", "item3"], "group");
    });
  });
});
