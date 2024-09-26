import {Inject, Middleware} from "@tsed/common";

import type {OidcInteractionContext} from "../services/OidcInteractionContext.js";

@Middleware()
export class OidcInteractionMiddleware {
  @Inject()
  protected oidcInteractionContext: OidcInteractionContext;

  async use() {
    await this.oidcInteractionContext.interactionDetails();
  }
}
