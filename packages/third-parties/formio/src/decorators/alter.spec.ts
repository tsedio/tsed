import {Alter} from "./alter.js";
import {AlterHook} from "../domain/AlterHook.js";
import {Store} from "@tsed/core";

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
