import {Store} from "@tsed/core";

import {JobsController} from "./jobController.js";

describe("@JobsController()", () => {
  it("should set empty metadata", () => {
    @JobsController()
    class Test {}

    const store = Store.from(Test);
    expect(store.get("agenda")).toEqual(undefined);
  });
  it("should set namespace metadata", () => {
    @JobsController({namespace: "nsp1"})
    class Test {}

    const store = Store.from(Test);
    expect(store.get("agenda")).toEqual({
      namespace: "nsp1"
    });
  });
});
