import {Context, Inject, Middleware, MiddlewareMethods} from "@tsed/common";
import {KeycloakAuthOptions, KeycloakService} from "@tsed/keycloak";

@Middleware()
export class KeycloakMiddleware implements MiddlewareMethods {
  @Inject()
  keycloakService: KeycloakService;

  public use(@Context() ctx: Context) {
    const options: KeycloakAuthOptions = ctx.endpoint.store.get(KeycloakMiddleware);
    if (options.roles) {
      return this.keycloakService.protect(options.roles);
    }
    return this.keycloakService.protect();
  }
}
