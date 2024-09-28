import {Store} from "@tsed/core";

import {Emit} from "../index.js";

describe("Emit", () => {
  it("should set metadata", () => {
    class Test {}

    Emit("eventName")(Test, "test", {} as any);

    const store = Store.from(Test);
    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          returns: {
            eventName: "eventName",
            type: "emit"
          }
        }
      }
    });
  });
});
