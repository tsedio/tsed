import {Context, Inject, InjectorService, Middleware} from "@tsed/common";
import {
  INTERACTION_CONTEXT,
  INTERACTION_DETAILS,
  INTERACTION_GRANT_ID,
  INTERACTION_PARAMS,
  INTERACTION_PROMPT,
  INTERACTION_SESSION,
  INTERACTION_UID
} from "../constants/constants";
import {OidcInteractionContext} from "../services/OidcInteractionContext";
import {OidcInteractions} from "../services/OidcInteractions";

@Middleware()
export class OidcInteractionMiddleware {
  @Inject()
  protected oidcInteractionContext: OidcInteractionContext;

  async use() {
    await this.oidcInteractionContext.interactionDetails();
  }
}
