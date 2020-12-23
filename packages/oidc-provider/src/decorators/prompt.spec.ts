import {ParamMetadata} from "@tsed/common";
import {expect} from "chai";
import {INTERACTION_PROMPT, INTERACTION_UID} from "../constants";
import {Prompt} from "./prompt";

describe("@Prompt", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Prompt() uid: Prompt) {}
    }

    const entity = ParamMetadata.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_PROMPT);
  });
});
