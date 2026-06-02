import {Store} from "@tsed/core";

import {Define} from "./define.js";
import {JobsController} from "./jobController.js";

describe("@Define()", () => {
  it("should set empty metadata", () => {
    @JobsController()
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

    expect(store.get("agenda").define).toEqual({
      testDefineDecorator: {},
      testDefineDecorator2: {}
    });
  });

  it("should set options metadata", () => {
    @JobsController()
    class Test {
      @Define({
        name: "testDefineDecoratorCustomName",
        priority: 20
      })
      test() {
        // test
      }
    }

    const store = Store.from(Test);
    expect(store.get("agenda").define).toEqual({
      test: {
        name: "testDefineDecoratorCustomName",
        priority: 20
      }
    });
  });
});
