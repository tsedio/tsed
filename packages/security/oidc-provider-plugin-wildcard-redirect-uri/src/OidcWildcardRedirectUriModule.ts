import {constant, logger, Module} from "@tsed/di";
import {OidcSettings} from "@tsed/oidc-provider";
import Provider, {errors, type KoaContextWithOIDC} from "oidc-provider";
// @ts-ignore
import psl from "psl";

import {wildcardRedirectUriAllowed} from "./utils/wildcardRedirectUriAllowed.js";

declare global {
  namespace TsED {
    interface OIDCPluginSettings {
      wildcard: {
        enabled?: boolean;
      };
    }
  }
}

@Module()
export class OidcWildcardRedirectUriModule {
  readonly enabled = constant<boolean>("oidc.plugins.wildcard.enabled", false);

  $onCreateOIDC(provider: Provider) {
    if (this.enabled) {
      const {redirectUriAllowed, postLogoutRedirectUriAllowed} = provider.Client.prototype;
      provider.Client.prototype.redirectUriAllowed = wildcardRedirectUriAllowed(redirectUriAllowed, "redirectUris");
      provider.Client.prototype.postLogoutRedirectUriAllowed = wildcardRedirectUriAllowed(
        postLogoutRedirectUriAllowed,
        "postLogoutRedirectUris"
      );

      logger().warn("⚠️⚠️⚠️ OIDC Wildcard Uris plugin is ENABLED ⚠️⚠️⚠️");
    }
  }

  $alterOidcConfiguration(config: OidcSettings): Promise<OidcSettings> {
    if (this.enabled) {
      const actualProperties = config?.extraClientMetadata?.properties || [];

      config.extraClientMetadata = {
        properties: [...actualProperties, "redirect_uris", "post_logout_redirect_uris"],
        validator: this.validator.bind(this)
      };
    }

    return Promise.resolve(config);
  }

  validator(ctx: KoaContextWithOIDC, key: string, value: any) {
    if (key === "redirect_uris") {
      for (const redirectUri of value) {
        if (redirectUri.includes("*")) {
          const {hostname, href} = new URL(redirectUri);

          if (href.split("*").length !== 2) {
            throw new errors.InvalidClientMetadata("redirect_uris with a wildcard may only contain a single one");
          }

          if (!hostname.includes("*")) {
            throw new errors.InvalidClientMetadata("redirect_uris may only have a wildcard in the hostname");
          }

          if (!psl.get(hostname.split("*.")[1])) {
            throw new errors.InvalidClientMetadata(
              "redirect_uris with a wildcard must not match an eTLD+1 of a known public suffix domain"
            );
          }
        }
      }
    } else if (key === "post_logout_redirect_uris") {
      for (const postLogoutRedirectUri of value) {
        if (postLogoutRedirectUri.includes("*")) {
          const {hostname, href} = new URL(postLogoutRedirectUri);

          if (href.split("*").length !== 2) {
            throw new errors.InvalidClientMetadata("post_logout_redirect_uris with a wildcard may only contain a single one");
          }

          if (!hostname.includes("*")) {
            throw new errors.InvalidClientMetadata("post_logout_redirect_uris may only have a wildcard in the hostname");
          }

          if (!psl.get(hostname.split("*.")[1])) {
            throw new errors.InvalidClientMetadata(
              "post_logout_redirect_uris with a wildcard must not match an eTLD+1 of a known public suffix domain"
            );
          }
        }
      }
    }
  }
}
