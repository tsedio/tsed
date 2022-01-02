import {expect} from "chai";
import {INTERACTION_PARAMS} from "../constants";
import {Params} from "./params";
import {JsonParameterStore} from "@tsed/schema";

describe("@Params", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Params() params: Params) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_PARAMS);
  });
});
