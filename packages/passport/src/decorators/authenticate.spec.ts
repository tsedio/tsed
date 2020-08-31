import {Store} from "@tsed/core";
import {expect} from "chai";
import {Authenticate, PassportMiddleware} from "../index";

describe("@Authenticate", () => {
  it("should store data", () => {
    class Test {
      @Authenticate("local", {security: "security"})
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      method: "authenticate",
      options: {
        security: "security"
      },
      protocol: "local",
      originalUrl: true
    });
  });
  it("should store data (without originalUrl)", () => {
    class Test {
      @Authenticate("local", {security: "security", originalUrl: false})
      test() {}
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      method: "authenticate",
      options: {
        security: "security",
        originalUrl: false
      },
      protocol: "local",
      originalUrl: false
    });
  });
});
