import {Store} from "@tsed/core";
import {Activity} from "./activity";
import {Temporal} from "./temporal";

describe("@Activity()", () => {
  it("should set metadata", () => {
    @Temporal()
    class Test {
      @Activity()
      testActivityDecorator() {
        // test
      }
    }

    const store = Store.from(Test);

    expect(store.get("temporal").activities).toEqual({
      testActivityDecorator: {}
    });
  });

  it("should set options metadata", () => {
    @Temporal()
    class Test {
      @Activity({
        name: "testActivityDecoratorCustomName"
      })
      test() {
        // test
      }
    }

    const store = Store.from(Test);
    expect(store.get("temporal").activities).toEqual({
      test: {
        name: "testActivityDecoratorCustomName"
      }
    });
  });
});
