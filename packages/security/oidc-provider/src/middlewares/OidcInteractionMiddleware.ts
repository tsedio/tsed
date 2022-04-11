import {Context, Inject, InjectorService, Middleware} from "@tsed/common";
import {
  INTERACTION_CONTEXT,
  INTERACTION_DETAILS,
  INTERACTION_PARAMS,
  INTERACTION_GRANT_ID,
  INTERACTION_PROMPT,
  INTERACTION_SESSION,
  INTERACTION_UID
} from "../constants/constants";
import {OidcInteractionContext} from "../services/OidcInteractionContext";
import {OidcInteractions} from "../services/OidcInteractions";

@Middleware()
export class OidcInteractionMiddleware {
  @Inject()
  protected oidcInteractions: OidcInteractions;

  @Inject()
  protected injector: InjectorService;

  async use(@Context() context: Context) {
    const oidcInteraction = this.injector.invoke<OidcInteractionContext>(OidcInteractionContext, context.container);
    const interactionDetails = await oidcInteraction.interactionDetails();
    const {uid, prompt, params, session, grantId} = interactionDetails as any;

    context.set(INTERACTION_CONTEXT, oidcInteraction);
    context.set(INTERACTION_DETAILS, interactionDetails);
    context.set(INTERACTION_UID, uid);
    context.set(INTERACTION_PROMPT, prompt);
    context.set(INTERACTION_PARAMS, params);
    context.set(INTERACTION_GRANT_ID, grantId);
    context.set(INTERACTION_SESSION, session);
  }
}
