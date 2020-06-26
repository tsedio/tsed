import {ContentType, EndpointRegistry} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";

describe("ContentType", () => {
  it("should create middleware", () => {
    class Test {
      @ContentType("application/json")
      test() {
      }
    }

    const store = Store.fromMethod(Test, "test");
    expect(store.get("produces")).to.deep.eq(["application/json"]);
    expect(EndpointRegistry.get(Test, "test").afterMiddlewares.length).to.eq(1);
  });
});
