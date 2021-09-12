import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {OnAny} from "./onAny";

describe("@OnAny()", () => {
  it("should set metadata", () => {
    class Test {
      @OnAny()
      testAnyEventListener() {
        // test
      }
    }

    const store = Store.from(Test);

    expect(store.get("eventEmitter")).to.deep.eq({
      onAny: {
        testAnyEventListener: {}
      }
    });
  });
});
