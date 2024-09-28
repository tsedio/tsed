import {Store} from "@tsed/core";

import {OnHook} from "../domain/OnHook.js";
import {On} from "./on.js";

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
