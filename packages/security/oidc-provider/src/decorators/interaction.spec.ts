import {Store} from "@tsed/core";
import {GlobalProviders} from "@tsed/di";

import {INTERACTION_OPTIONS} from "../constants/constants.js";
import {OidcInteractionMethods} from "../domain/OidcInteractionMethods.js";
import {Interaction} from "./interaction.js";

describe("@Interaction", () => {
  it("should create an interaction", () => {
    @Interaction({
      name: "login",
      requestable: true,
      priority: 0
    })
    class CustomInteraction implements OidcInteractionMethods {}

    const store = Store.from(CustomInteraction);
    const provider = GlobalProviders.get(CustomInteraction)!;

    expect(provider.subType).toEqual("interaction");
    expect(store.get(INTERACTION_OPTIONS)).toEqual({
      name: "login",
      requestable: true,
      priority: 0
    });
  });
});
