import {Type} from "@tsed/core";
import {JwksKeyParameters} from "@tsed/jwks";
import {Configuration} from "oidc-provider";
import {OidcAccountsMethods} from "./OidcAccountsMethods";

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
}

declare global {
  namespace TsED {
    interface Configuration {
      oidc: OidcSettings;
    }
  }
}
