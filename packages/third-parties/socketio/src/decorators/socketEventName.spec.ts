import {Store} from "@tsed/core";

import {SocketEventName} from "../index.js";

describe("@SocketEventName", () => {
  it("should set metadata", () => {
    class Test {}

    SocketEventName(Test, "test", 0);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "eventName",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
