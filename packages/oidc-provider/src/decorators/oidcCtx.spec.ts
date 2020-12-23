import {ParamMetadata} from "@tsed/common";
import {expect} from "chai";
import {INTERACTION_CONTEXT} from "../constants";
import {OidcCtx} from "./oidcCtx";

describe("@OidcCtx", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@OidcCtx() oidcCtx: OidcCtx) {}
    }

    const entity = ParamMetadata.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_CONTEXT);
  });
});
