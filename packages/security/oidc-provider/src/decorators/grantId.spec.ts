import {INTERACTION_GRANT_ID} from "../constants/constants";
import {JsonParameterStore} from "@tsed/schema";
import {GrantId} from "./grantId";

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
