import {expect} from "chai";
import {INTERACTION_CONTEXT} from "../constants/constants";
import {OidcCtx} from "./oidcCtx";
import {JsonParameterStore} from "@tsed/schema";

describe("@OidcCtx", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@OidcCtx() oidcCtx: OidcCtx) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_CONTEXT);
  });
});
