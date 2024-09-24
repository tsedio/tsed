import {Store} from "@tsed/core";

import {InputAndBroadcast} from "../index.js";

describe("InputAndBroadcast", () => {
  it("should set metadata", () => {
    class Test {}

    InputAndBroadcast("eventName")(Test, "test", {} as any);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          eventName: "eventName",
          methodClassName: "test",
          returns: {
            eventName: "eventName",
            type: "broadcast"
          }
        }
      }
    });
  });
});
