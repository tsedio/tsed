import type {Adapter} from "@tsed/adapters";
import type {Type} from "@tsed/core";
import type {JwksKeyParameters} from "@tsed/jwks";
import type {Configuration} from "oidc-provider";

import type {OidcAccountsMethods} from "./OidcAccountsMethods.js";

export interface OidcSettings extends Configuration {
  /**
   * force the secure cookie. By default, in dev mode it's disabled and in production it's enabled.
   */
  secureCookies?: boolean;
  /**
   * Path on which the oidc-provider instance is mounted.
   */
  path?: string;
  /**
   * Issuer URI. By default, Ts.ED create issuer with http://localhost:${httpPort}
   */
  issuer?: string;
  /**
   * Path to store jwks keys.
   */
  jwksPath?: string;
  /**
   * Generate jwks from given certificates
   */
  certificates?: JwksKeyParameters[];
  /**
   * Secure keys.
   */
  secureKey?: string[];
  /**
   * Enable proxy.
   */
  proxy?: boolean;
  /**
   * Allow redirect_uri on HTTP protocol and localhost domain.
   */
  allowHttpLocalhost?: boolean;
  /**
   * Injectable service to manage accounts.
   */
  Accounts?: Type<OidcAccountsMethods>;
  /**
   * Injectable adapter to manage database connexion.
   */
  Adapter?: Type<Adapter>;
  /**
   * Use the connection name for the OIDCRedisAdapter.
   */
  connectionName?: string;

  plugins?: TsED.OIDCPluginSettings;

  render?: {
    /**
     * By default ["clientSecret"] is omitted
     */
    omitClientProps?: string[];
  };
}

declare global {
  namespace TsED {
    interface OIDCPluginSettings {}

    interface Configuration {
      oidc: OidcSettings;
    }
  }
}
