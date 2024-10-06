import {Store} from "@tsed/core";

import {OnEvent} from "../decorators/onEvent.js";

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

    expect(store.get("eventEmitter")).toEqual({
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
