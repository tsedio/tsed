import {JsonParameterStore} from "@tsed/schema";

import {INTERACTION_PARAMS} from "../constants/constants.js";
import {Params} from "./params.js";

describe("@Params", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Params() params: Params) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_PARAMS);
  });
});
