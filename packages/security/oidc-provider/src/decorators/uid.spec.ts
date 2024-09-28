import {JsonParameterStore} from "@tsed/schema";

import {INTERACTION_UID} from "../constants/constants.js";
import {Uid} from "./uid.js";

describe("@Uid", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Uid() uid: string) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_UID);
  });
});
