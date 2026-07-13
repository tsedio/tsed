import {s} from "../../fn/index.js";
import {View} from "../../index.js";

describe("@View", () => {
  it("should set metadata", () => {
    class Test {
      @View("page", {test: "test"})
      test() {}
    }

    const endpoint = s.store.method(Test, "test");
    expect(endpoint.view).toEqual({
      path: "page",
      options: {test: "test"}
    });
  });
});
