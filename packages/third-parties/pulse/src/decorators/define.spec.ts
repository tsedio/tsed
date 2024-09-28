import {Store} from "@tsed/core";

import {Define} from "./define.js";
import {Pulse} from "./pulse.js";

describe("@Define()", () => {
  it("should set empty metadata", () => {
    @Pulse()
    class Test {
      @Define()
      testDefineDecorator() {
        // test
      }

      @Define()
      testDefineDecorator2() {
        // test 2
      }
    }

    const store = Store.from(Test);

    expect(store.get("pulse").define).toEqual({
      testDefineDecorator: {},
      testDefineDecorator2: {}
    });
  });

  it("should set options metadata", () => {
    @Pulse()
    class Test {
      @Define({
        name: "testDefineDecoratorCustomName",
        priority: "highest"
      })
      test() {
        // test
      }
    }

    const store = Store.from(Test);
    expect(store.get("pulse").define).toEqual({
      test: {
        name: "testDefineDecoratorCustomName",
        priority: "highest"
      }
    });
  });
});
