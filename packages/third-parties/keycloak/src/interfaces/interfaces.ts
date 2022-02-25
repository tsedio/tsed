import {KeycloakConfig, KeycloakOptions} from "keycloak-connect";
import {KeycloakMiddlewareOptions} from "./KeycloakMiddlewareOptions";

declare global {
  namespace TsED {
    interface Configuration {
      keycloak?: {
        /**
         * Keycloak options for web session store, scopes and cookies. Default empty object.
         */
        options?: KeycloakOptions;
        /**
         * Keycloak configuration or the path to the configuration file.
         */
        config?: KeycloakConfig|string;
        /**
         * Provide additional options that are passed to middleware:
         * `logout` URL for logging a user out. Defaults to `/logout`.
         * `admin` Root URL for Keycloak admin callbacks.  Defaults to `/`.
         */
        middlewareOptions?: KeycloakMiddlewareOptions;
      };
    }
  }
}
