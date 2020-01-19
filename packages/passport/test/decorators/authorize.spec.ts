import {Store} from "@tsed/core";
import {expect} from "chai";
import {Authorize, PassportMiddleware} from "../../src";

describe("@Authorize", () => {
  it("should store data", () => {
    class Test {
      @Authorize("local", {security: "security"})
      test() {
      }
    }

    const store = Store.fromMethod(Test, "test");

    expect(store.get(PassportMiddleware)).to.deep.equal({
      "method": "authorize",
      "options": {
        "security": "security"
      },
      "protocol": "local"
    });
  });
});
