import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {OnEvent} from "../decorators/onEvent";

describe("@OnEvent()", () => {
  it("should set metadata", () => {
    class Test {
      @OnEvent("testEvent")
      testEventListener1() {
        // test
      }

      @OnEvent("testEvent2", {async: true})
      async testEventListener2() {
        // test
      }
    }

    const store = Store.from(Test);

    expect(store.get("eventEmitter")).to.deep.eq({
      onEvent: {
        testEventListener1: {
          event: "testEvent",
          options: undefined
        },
        testEventListener2: {
          event: "testEvent2",
          options: {
            async: true
          }
        }
      }
    });
  });
});
