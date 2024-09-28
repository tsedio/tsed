import {Store} from "@tsed/core";

import {Pulse} from "./pulse.js";

describe("@Pulse()", () => {
  it("should set empty metadata", () => {
    @Pulse()
    class Test {}

    const store = Store.from(Test);
    expect(store.get("pulse")).toEqual(undefined);
  });
  it("should set namespace metadata", () => {
    @Pulse({namespace: "nsp1"})
    class Test {}

    const store = Store.from(Test);
    expect(store.get("pulse")).toEqual({
      namespace: "nsp1"
    });
  });
});
