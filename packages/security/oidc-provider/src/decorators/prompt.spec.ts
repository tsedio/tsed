import {JsonParameterStore} from "@tsed/schema";

import {INTERACTION_PROMPT} from "../constants/constants.js";
import {Prompt} from "./prompt.js";

describe("@Prompt", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Prompt() uid: Prompt) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_PROMPT);
  });
});
