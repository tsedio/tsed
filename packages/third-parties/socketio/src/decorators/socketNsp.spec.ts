import {Store} from "@tsed/core";

import {SocketNsp} from "../index.js";

describe("SocketNsp", () => {
  it("should set metadata", () => {
    class Test {}

    SocketNsp(Test, "test", 0);

    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "socket_nsp",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
