import {SocketNsp} from "../index.js";
import {Store} from "@tsed/core";

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
