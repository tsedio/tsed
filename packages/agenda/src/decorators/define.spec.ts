import {Store} from "@tsed/core";
import {expect} from "chai";
import {Agenda} from "./agenda";
import {Define} from "./define";

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

    expect(store.get("agenda").define).to.deep.eq({
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
    expect(store.get("agenda").define).to.deep.eq({
      test: {
        name: "testDefineDecoratorCustomName",
        priority: 20
      }
    });
  });
});
