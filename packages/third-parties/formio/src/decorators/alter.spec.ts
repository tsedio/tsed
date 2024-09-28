import {Store} from "@tsed/core";

import {AlterHook} from "../domain/AlterHook.js";
import {Alter} from "./alter.js";

describe("@Alter", () => {
  it("should register a hook listener", () => {
    @Alter("custom")
    class AlterCustom implements AlterHook {
      transform() {}
    }

    const store = Store.from(AlterCustom);
    expect(store.get("formio:alter:name")).toEqual("custom");
  });
});
