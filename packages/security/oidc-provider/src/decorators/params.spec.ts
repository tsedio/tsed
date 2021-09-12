import {ParamMetadata} from "@tsed/common";
import {expect} from "chai";
import {INTERACTION_PARAMS} from "../constants";
import {Params} from "./params";

describe("@Params", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Params() params: Params) {}
    }

    const entity = ParamMetadata.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_PARAMS);
  });
});
