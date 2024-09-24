import {Store} from "@tsed/core";

import {Input} from "../index.js";

describe("Input", () => {
  it("should set metadata", () => {
    class Test {}

    Input("eventName")(Test, "test", {} as any);

    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          eventName: "eventName",
          methodClassName: "test"
        }
      }
    });
  });
});
