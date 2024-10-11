import {Inject} from "@tsed/di";
import {Middleware} from "@tsed/platform-middlewares";

import {OidcInteractionContext} from "../services/OidcInteractionContext.js";

@Middleware()
export class OidcInteractionMiddleware {
  @Inject()
  protected oidcInteractionContext: OidcInteractionContext;

  async use() {
    await this.oidcInteractionContext.interactionDetails();
  }
}
