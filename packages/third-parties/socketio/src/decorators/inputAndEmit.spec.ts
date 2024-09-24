import {Store} from "@tsed/core";

import {InputAndEmit} from "../index.js";

describe("InputAndEmit", () => {
  it("should set metadata", () => {
    class Test {}

    InputAndEmit("eventName")(Test, "test", {} as any);
    const store = Store.from(Test);
    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          eventName: "eventName",
          methodClassName: "test",
          returns: {
            eventName: "eventName",
            type: "emit"
          }
        }
      }
    });
  });
});
