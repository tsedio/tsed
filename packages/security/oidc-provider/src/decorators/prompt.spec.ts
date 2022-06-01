import {INTERACTION_PROMPT} from "../constants/constants";
import {Prompt} from "./prompt";
import {JsonParameterStore} from "@tsed/schema";

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
