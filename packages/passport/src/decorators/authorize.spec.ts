import {Store} from "@tsed/core";
import {expect} from "chai";
import {Authorize, PassportMiddleware} from "../index";

describe("@Authorize", () => {
  it("should store data", () => {
    class Test {
      @Authorize("local", {
        security: {
          test: ["scope"]
        }
      })
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      method: "authorize",
      options: {
        security: {
          test: ["scope"]
        }
      },
      originalUrl: true,
      protocol: "local"
    });
  });
  it("should store data (without originalUrl)", () => {
    class Test {
      @Authorize("local", {
        security: {
          test: ["scope"]
        },
        originalUrl: false
      })
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      method: "authorize",
      options: {
        security: {
          test: ["scope"]
        },
        originalUrl: false
      },
      originalUrl: false,
      protocol: "local"
    });
  });
});
