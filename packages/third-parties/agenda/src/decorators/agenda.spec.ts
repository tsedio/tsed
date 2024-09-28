import {Store} from "@tsed/core";

import {Agenda} from "./agenda.js";

describe("@Agenda()", () => {
  it("should set empty metadata", () => {
    @Agenda()
    class Test {}

    const store = Store.from(Test);
    expect(store.get("agenda")).toEqual(undefined);
  });
  it("should set namespace metadata", () => {
    @Agenda({namespace: "nsp1"})
    class Test {}

    const store = Store.from(Test);
    expect(store.get("agenda")).toEqual({
      namespace: "nsp1"
    });
  });
});
