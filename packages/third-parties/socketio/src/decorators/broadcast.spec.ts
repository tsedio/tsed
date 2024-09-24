import {Store} from "@tsed/core";

import {Broadcast} from "../index.js";

describe("Broadcast", () => {
  it("should set metadata", () => {
    class Test {}

    Broadcast("eventName")(Test, "test", {} as any);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          returns: {
            eventName: "eventName",
            type: "broadcast"
          }
        }
      }
    });
  });
});
