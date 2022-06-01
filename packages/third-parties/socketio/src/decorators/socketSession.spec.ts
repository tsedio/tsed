import {Store} from "@tsed/core";
import {SocketSession} from "../index";

describe("SocketSession", () => {
  it("should set metadata", () => {
    class Test {}

    SocketSession(Test, "test", 0);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "session",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
