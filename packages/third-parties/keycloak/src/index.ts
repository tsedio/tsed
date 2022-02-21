import {KeycloakConfig, KeycloakOptions} from "keycloak-connect";

declare global {
  namespace TsED {
    interface Configuration {
      keycloak?: {
        /**
         * Enable Keycloak. Default false.
         */
        enabled?: boolean;
        /**
         * Keycloak options for web session store, scopes and cookies. Default empty object.
         */
        options?: KeycloakOptions;
        /**
         * Keycloak configuration or the path to the configuration file.
         */
        config: KeycloakConfig | string;
      };
    }
  }
}
