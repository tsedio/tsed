import {JsonParameterStore} from "@tsed/schema";

import {INTERACTION_GRANT_ID} from "../constants/constants.js";
import {GrantId} from "./grantId.js";

describe("@GrandId", () => {
  it("should inject grantId", () => {
    class MyInteraction {
      $prompt(@GrantId() grandId: string) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_GRANT_ID);
  });
});
