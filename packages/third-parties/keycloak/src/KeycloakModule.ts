import {Constant, Inject, OnDestroy} from "@tsed/di";
import {AfterListen, Logger} from "@tsed/common";
import KeycloakConnect, {Keycloak, KeycloakConfig, KeycloakOptions} from "keycloak-connect";

export class KeycloakModule implements OnDestroy, AfterListen {
  private keycloak: Keycloak;

  @Inject()
  protected logger: Logger;

  @Constant("keycloak.enabled", false)
  private loadKeycloak: boolean;

  @Constant("keycloak.kcOptions", {})
  private kcOptions: KeycloakOptions;

  @Constant("keycloak.kcConfig")
  private kcConfig: KeycloakConfig | string;

  async $afterListen(): Promise<any> {
    if (this.loadKeycloak) {
      this.logger.info("Initialize Keycloak adapter...");
      this.keycloak = new KeycloakConnect(this.kcOptions, this.kcConfig);
    }
  }

  $onDestroy(): Promise<any> | void {
    return undefined;
  }
}
