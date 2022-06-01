import {INTERACTION_CONTEXT} from "../constants/constants";
import {OidcCtx} from "./oidcCtx";
import {JsonParameterStore} from "@tsed/schema";

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
