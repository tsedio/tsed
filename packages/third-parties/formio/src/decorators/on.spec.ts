import {Store} from "@tsed/core";
import {expect} from "chai";
import {OnHook} from "../domain/OnHook";
import {On} from "./on";

describe("@On", () => {
  it("should register a hook listener", () => {
    @On("custom")
    class CustomEvent implements OnHook {
      on() {}
    }

    const store = Store.from(CustomEvent);
    expect(store.get("formio:on:name")).to.equal("custom");
  });
});
