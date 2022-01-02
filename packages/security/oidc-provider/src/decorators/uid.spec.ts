import {expect} from "chai";
import {INTERACTION_UID} from "../constants";
import {Uid} from "./uid";
import {JsonParameterStore} from "@tsed/schema";

describe("@Uid", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Uid() uid: string) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_UID);
  });
});
