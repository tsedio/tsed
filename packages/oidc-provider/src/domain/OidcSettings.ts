import {Type} from "@tsed/core";
import {Configuration} from "oidc-provider";
import {OidcAccountsMethods} from "./OidcAccountsMethods";

export interface OidcSettings extends Configuration {
  /**
   * Issuer URI. By default Ts.ED create issuer with http://localhost:${httpPort}
   */
  issuer?: string;
  /**
   * Path to store jwks keys.
   */
  jwksPath?: string;
  /**
   * Secure keys.
   */
  secureKey?: string[];
  /**
   * Enable proxy.
   */
  proxy?: boolean;
  /**
   * Injectable service to manage accounts.
   */
  Accounts?: Type<OidcAccountsMethods>;
  /**
   * Injectable service to manage clients.
   */
  // Clients?: Type<OidcClientsMethods>;
}

declare global {
  namespace TsED {
    interface Configuration {
      oidc: OidcSettings;
    }
  }
}
