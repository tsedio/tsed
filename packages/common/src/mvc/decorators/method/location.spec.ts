import {EndpointMetadata} from "@tsed/common";
import {expect} from "chai";
import {Location} from "./location";

describe("Location", () => {
  it("should create middleware", () => {
    class Test {
      @Location("/test")
      test() {}
    }

    const endpoint = EndpointMetadata.get(Test, "test");

    expect(endpoint.location).to.eq("/test");
  });
});
