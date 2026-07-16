import {SocketMiddleware, SocketProviderTypes} from "../index.js";
import {Store} from "@tsed/core";

describe("@SocketMiddleware", () => {
  it("should register the middleware", () => {
    @SocketMiddleware()
    class Test {
      use() {}
    }

    expect(Store.from(Test).get("socketIO")).toEqual({
      type: SocketProviderTypes.MIDDLEWARE,
      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });
  });
});
