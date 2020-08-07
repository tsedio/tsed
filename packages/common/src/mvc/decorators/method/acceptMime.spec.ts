import {AcceptMime, AcceptMimesMiddleware} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";

describe("AcceptMime", () => {
  it("should set metadata", () => {
    class Test {
      @AcceptMime("application/json")
      test() {
      }
    }

    const store = Store.fromMethod(Test, "test");
    expect(store.get(AcceptMimesMiddleware)).to.deep.eq(["application/json"]);
  });
});
