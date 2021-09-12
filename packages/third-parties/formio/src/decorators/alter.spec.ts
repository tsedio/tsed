import {Store} from "@tsed/core";
import {expect} from "chai";
import {AlterHook} from "../domain/AlterHook";
import {Alter} from "./alter";

describe("@Alter", () => {
  it("should register a hook listener", () => {
    @Alter("custom")
    class AlterCustom implements AlterHook {
      transform() {}
    }

    const store = Store.from(AlterCustom);
    expect(store.get("formio:alter:name")).to.equal("custom");
  });
});
