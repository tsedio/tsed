import {GrantId} from "@tsed/oidc-provider";
import {expect} from "chai";
import {INTERACTION_GRANT_ID} from "../constants/constants";
import {JsonParameterStore} from "@tsed/schema";

describe("@GrandId", () => {
  it("should inject grantId", () => {
    class MyInteraction {
      $prompt(@GrantId() grandId: string) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).to.equal("$CTX");
    expect(entity.expression).to.equal(INTERACTION_GRANT_ID);
  });
});
