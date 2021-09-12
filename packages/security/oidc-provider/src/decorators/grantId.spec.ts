import {ParamMetadata} from "@tsed/common";
import {GrantId} from "@tsed/oidc-provider";
import {expect} from "chai";
import {INTERACTION_GRANT_ID} from "../constants";

describe("@GrandId", () => {
  it("should inject grantId", () => {
    class MyInteraction {
      $prompt(@GrantId() grandId: string) {}
    }

    const entity = ParamMetadata.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_GRANT_ID);
  });
});
