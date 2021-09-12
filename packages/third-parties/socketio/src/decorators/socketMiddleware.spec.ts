import {Store} from "@tsed/core";
import {expect} from "chai";
import {SocketMiddleware, SocketProviderTypes} from "../index";

describe("@SocketMiddleware", () => {
  it("should register the middleware", () => {
    @SocketMiddleware()
    class Test {
      use() {}
    }

    expect(Store.from(Test).get("socketIO")).to.deep.eq({
      type: SocketProviderTypes.MIDDLEWARE,
      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });
  });
});
