import {INTERACTION_UID} from "../constants/constants";
import {Uid} from "./uid";
import {JsonParameterStore} from "@tsed/schema";

describe("@Uid", () => {
  it("should inject uid", () => {
    class MyInteraction {
      $prompt(@Uid() uid: string) {}
    }

    const entity = JsonParameterStore.get(MyInteraction, "$prompt", 0);

    expect(entity.paramType).toEqual("$CTX");
    expect(entity.expression).toEqual(INTERACTION_UID);
  });
});
