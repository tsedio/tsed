import {Store} from "@tsed/core";
import {expect} from "chai";
import {Authenticate, PassportMiddleware} from "../index";
import {Security} from "@tsed/schema";

describe("@Authenticate", () => {
  it("should store data", () => {
    class Test {
      @Authenticate("local", {
        security: {
          test: ["scope"]
        }
      })
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      method: "authenticate",
      options: {
        security: {
          test: ["scope"]
        }
      },
      protocol: "local",
      originalUrl: true
    });
  });
  it("should store data (without originalUrl)", () => {
    class Test {
      @Authenticate("local", {
        security: {
          test: ["scope"]
        },
        originalUrl: false
      })
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      method: "authenticate",
      options: {
        security: {
          test: ["scope"]
        },
        originalUrl: false
      },
      protocol: "local",
      originalUrl: false
    });
  });
});
