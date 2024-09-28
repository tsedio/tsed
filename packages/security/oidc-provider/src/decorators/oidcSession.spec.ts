import {JsonParameterStore} from "@tsed/schema";

import {INTERACTION_SESSION} from "../constants/constants.js";
import {OidcSession} from "./oidcSession.js";

describe("@OidcSession", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@OidcSession() session: OidcSession) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_SESSION);
  });
});
