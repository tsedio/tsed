import {Store} from "@tsed/core";

import {SocketMiddlewareError, SocketProviderTypes} from "../index.js";

describe("@SocketMiddlewareError", () => {
  it("should register the metadata and middleware", () => {
    @SocketMiddlewareError()
    class Test {
      use() {}
    }

    expect(Store.from(Test).get("socketIO")).toEqual({
      type: SocketProviderTypes.MIDDLEWARE,
      error: true,
      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });
  });
});
