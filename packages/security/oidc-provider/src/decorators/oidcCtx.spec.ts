import {JsonParameterStore} from "@tsed/schema";

import {INTERACTION_CONTEXT} from "../constants/constants.js";
import {OidcCtx} from "./oidcCtx.js";

describe("@OidcCtx", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@OidcCtx() oidcCtx: OidcCtx) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_CONTEXT);
  });
});
