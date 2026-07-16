import {SocketErr} from "../index.js";
import {Store} from "@tsed/core";

describe("@SocketErr", () => {
  it("should set metadata", () => {
    class Test {}

    SocketErr(Test, "test", 0);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "error",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
