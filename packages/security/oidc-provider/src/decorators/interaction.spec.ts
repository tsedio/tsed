import {Store} from "@tsed/core";
import {GlobalProviders} from "@tsed/di";
import {expect} from "chai";
import {INTERACTION_OPTIONS} from "../constants/constants";
import {OidcInteractionMethods} from "../domain/OidcInteractionMethods";
import {Interaction} from "./interaction";

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

    expect(provider.subType).to.equal("interaction");
    expect(store.get(INTERACTION_OPTIONS)).to.deep.eq({
      name: "login",
      requestable: true,
      priority: 0
    });
  });
});
