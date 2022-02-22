import {Constant, Inject, Module} from "@tsed/di";
import {BeforeRoutesInit, Logger, PlatformApplication} from "@tsed/common";
import {KeycloakService} from "./services/KeycloakFactory";
import {KeycloakMiddlewareOptions} from "./interfaces/KeycloakMiddlewareOptions";

@Module()
export class KeycloakModule implements BeforeRoutesInit {
  @Inject()
  logger: Logger;

  @Inject()
  app: PlatformApplication;

  @Inject()
  keycloakService: KeycloakService;

  @Constant("keycloak.middlewareOptions")
  private middlewareOptions: KeycloakMiddlewareOptions;

  $beforeRoutesInit(): void {
    this.logger.info("Initialize Keycloak adapter...");
    if (this.middlewareOptions) {
      this.app.use(this.keycloakService.middleware(this.middlewareOptions));
    } else {
      this.app.use(this.keycloakService.middleware());
    }
  }
}
