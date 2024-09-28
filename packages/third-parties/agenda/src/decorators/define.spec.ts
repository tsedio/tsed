import {Store} from "@tsed/core";

import {Agenda} from "./agenda.js";
import {Define} from "./define.js";

describe("@Define()", () => {
  it("should set empty metadata", () => {
    @Agenda()
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
    @Agenda()
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
