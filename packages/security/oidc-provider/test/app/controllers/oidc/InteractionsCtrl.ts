import {Get, PathParams} from "@tsed/common";
import {Interactions, OidcCtx} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";
import {AbortInteraction} from "../../interactions/AbortInteraction";
import {ConsentInteraction} from "../../interactions/ConsentInteraction";
import {CustomInteraction} from "../../interactions/CustomInteraction";
import {LoginInteraction} from "../../interactions/LoginInteraction";

@Name("Oidc")
@Interactions({
  path: "/interaction/:uid",

  // this list define the priority of each interaction!
  children: [LoginInteraction, ConsentInteraction, CustomInteraction, AbortInteraction]
})
export class InteractionsCtrl {
  @Get("/:interaction?")
  prompt(@PathParams("interaction") interaction: string, @OidcCtx() oidcCtx: OidcCtx) {
    return oidcCtx.runInteraction(interaction);
  }
}
