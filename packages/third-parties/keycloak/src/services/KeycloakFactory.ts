import {Configuration, registerProvider} from "@tsed/di";
import KeycloakConnect, {Keycloak, KeycloakConfig, KeycloakOptions} from "keycloak-connect";

export const KeycloakService = KeycloakConnect;
export type KeycloakService = Keycloak;
export type KeycloakSettings = {
  options: KeycloakOptions;
  config: KeycloakConfig;
};

registerProvider({
  provide: KeycloakService,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const keycloakSettings = settings.get<KeycloakSettings>("keycloak");
    return new KeycloakConnect(keycloakSettings.options, keycloakSettings.config);
  }
});
