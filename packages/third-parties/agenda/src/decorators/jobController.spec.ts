import {JobsController} from "./jobController.js";
import {Store} from "@tsed/core";

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
