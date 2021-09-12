import {Store} from "@tsed/core";
import {expect} from "chai";
import {Agenda} from "./agenda";

describe("@Agenda()", () => {
  it("should set empty metadata", () => {
    @Agenda()
    class Test {}

    const store = Store.from(Test);
    expect(store.get("agenda")).to.deep.eq({
      namespace: undefined
    });
  });
  it("should set namespace metadata", () => {
    @Agenda({namespace: "nsp1"})
    class Test {}

    const store = Store.from(Test);
    expect(store.get("agenda")).to.deep.eq({
      namespace: "nsp1"
    });
  });
});
