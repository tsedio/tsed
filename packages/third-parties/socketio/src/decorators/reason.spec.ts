import {Store} from "@tsed/core";

import {Nsp, SocketErr} from "../index.js";
import {Reason} from "./reason.js";

describe("Reason", () => {
  it("should set metadata", () => {
    class Test {}

    Reason(Test, "test", 0);
    const store = Store.from(Test);

    expect(store.get("socketIO")).toEqual({
      handlers: {
        test: {
          parameters: {
            "0": {
              filter: "reason",
              mapIndex: undefined
            }
          }
        }
      }
    });
  });
});
