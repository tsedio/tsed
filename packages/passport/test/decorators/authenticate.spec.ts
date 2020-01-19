import {Store} from "@tsed/core";
import {expect} from "chai";
import {Authenticate, PassportMiddleware} from "../../src";


describe("@Authenticate", () => {
  it("should store data", () => {
    class Test {
      @Authenticate("local", {security: "security"})
      test() {
      }
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      "method": "authenticate",
      "options": {
        "security": "security"
      },
      "protocol": "local"
    });
  });
});
