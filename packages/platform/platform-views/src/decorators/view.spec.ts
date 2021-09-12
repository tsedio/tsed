import {EndpointMetadata} from "@tsed/common";
import {expect} from "chai";
import {View} from "./view";

describe("View", () => {
  it("should set metadata", () => {
    class Test {
      @View("page", {test: "test"})
      test() {}
    }

    const endpoint = EndpointMetadata.get(Test, "test");
    expect(endpoint.view).to.deep.eq({
      path: "page",
      options: {test: "test"}
    });
  });
  it("should set metadata", () => {
    class Test {
      @View("page", {test: "test"})
      test() {}
    }

    const endpoint = EndpointMetadata.get(Test, "test");
    expect(endpoint.view).to.deep.eq({
      path: "page",
      options: {test: "test"}
    });
  });
});
