import {PathParams} from "@tsed/platform-params";
import {Get, Name} from "@tsed/schema";

import {Interactions, OidcCtx} from "../../../../src/index.js";
import {AbortInteraction} from "../../interactions/AbortInteraction.js";
import {ConsentInteraction} from "../../interactions/ConsentInteraction.js";
import {CustomInteraction} from "../../interactions/CustomInteraction.js";
import {LoginInteraction} from "../../interactions/LoginInteraction.js";

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
