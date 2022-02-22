import {Context, Inject, Middleware, MiddlewareMethods} from "@tsed/common";
import {KeycloakAuthOptions} from "../interfaces/KeycloakAuthOptions";
import {KeycloakService} from "../services/KeycloakFactory";

@Middleware()
export class KeycloakMiddleware implements MiddlewareMethods {
  @Inject()
  keycloakService: KeycloakService;

  public use(@Context() ctx: Context) {
    const options: KeycloakAuthOptions = ctx.endpoint.store.get(KeycloakMiddleware);
    return this.keycloakService.protect(options.role);
  }
}
