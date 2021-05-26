import {Store} from "@tsed/core";
import {expect} from "chai";
import {SocketMiddlewareError, SocketProviderTypes} from "../index";

describe("@SocketMiddlewareError", () => {
  it("should register the metadata and middleware", () => {
    @SocketMiddlewareError()
    class Test {
      use() {}
    }

    expect(Store.from(Test).get("socketIO")).to.deep.eq({
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
