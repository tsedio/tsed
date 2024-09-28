import {Store} from "@tsed/core";

import {OnAny} from "./onAny.js";

describe("@OnAny()", () => {
  it("should set metadata", () => {
    class Test {
      @OnAny()
      testAnyEventListener() {
        // test
      }
    }

    const store = Store.from(Test);

    expect(store.get("eventEmitter")).toEqual({
      onAny: {
        testAnyEventListener: {}
      }
    });
  });
});
