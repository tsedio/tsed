import {ParamMetadata} from "@tsed/common";
import {expect} from "chai";
import {INTERACTION_UID} from "../constants";
import {Uid} from "./uid";

describe("@Uid", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Uid() uid: string) {}
    }

    const entity = ParamMetadata.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_UID);
  });
});
