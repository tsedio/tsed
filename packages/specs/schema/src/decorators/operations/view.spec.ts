import {JsonMethodStore, View} from "../../index.js";

describe("@View", () => {
  it("should set metadata", () => {
    class Test {
      @View("page", {test: "test"})
      test() {}
    }

    const endpoint = JsonMethodStore.get(Test, "test");
    expect(endpoint.view).toEqual({
      path: "page",
      options: {test: "test"}
    });
  });
});
