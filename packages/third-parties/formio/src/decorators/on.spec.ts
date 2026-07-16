import {On} from "./on.js";
import {OnHook} from "../domain/OnHook.js";
import {Store} from "@tsed/core";

describe("@On", () => {
  it("should register a hook listener", () => {
    @On("custom")
    class CustomEvent implements OnHook {
      on() {}
    }

    const store = Store.from(CustomEvent);
    expect(store.get("formio:on:name")).toEqual("custom");
  });
});
