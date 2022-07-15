import {INTERACTION_SESSION} from "../constants/constants";
import {OidcSession} from "./oidcSession";
import {JsonParameterStore} from "@tsed/schema";

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
