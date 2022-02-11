import {Get} from "@tsed/common";
import {Interactions, OidcCtx} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";
import {ConsentInteraction} from "../../interactions/ConsentInteraction";
import {CustomInteraction} from "../../interactions/CustomInteraction";
import {LoginInteraction} from "../../interactions/LoginInteraction";

@Name("Oidc")
@Interactions({
  path: "/interaction/:uid",
  children: [LoginInteraction, ConsentInteraction, CustomInteraction]
})
export class InteractionsCtrl {
  @Get("/")
  async promptInteraction(@OidcCtx() oidcCtx: OidcCtx) {
    return oidcCtx.runInteraction();
  }
}
