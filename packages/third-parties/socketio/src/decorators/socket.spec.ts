import {Store} from "@tsed/core";

import {Socket} from "../index.js";

describe("Socket", () => {
  it("should set metadata", () => {
    class Test {}

    Socket(Test, "test", 0);

    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "socket",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
