import {Constant, Inject, Module} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {OIDC_PROVIDER_NODE_MODULE, OidcSettings} from "@tsed/oidc-provider";
// @ts-ignore
import type Provider, {KoaContextWithOIDC} from "oidc-provider";
// @ts-ignore
import psl from "psl";
import {wildcardRedirectUriAllowed} from "./utils/wildcardRedirectUriAllowed";

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
  @Constant("oidc.plugins.wildcard.enabled", false)
  readonly enabled: boolean;

  @Inject(Logger)
  protected logger: Logger;

  constructor(@Inject(OIDC_PROVIDER_NODE_MODULE) protected module: OIDC_PROVIDER_NODE_MODULE) {}

  async $onCreateOIDC(provider: Provider) {
    if (this.enabled) {
      const {redirectUriAllowed} = provider.Client.prototype;
      provider.Client.prototype.redirectUriAllowed = wildcardRedirectUriAllowed(redirectUriAllowed);

      this.logger.warn("⚠️⚠️⚠️ OIDC Wildcard Uris plugin is ENABLED ⚠️⚠️⚠️");
    }
  }

  async $alterOidcConfiguration(config: OidcSettings): Promise<OidcSettings> {
    if (this.enabled) {
      const actualProperties = config?.extraClientMetadata?.properties || [];

      config.extraClientMetadata = {
        properties: [...actualProperties, "redirect_uris"],
        validator: this.validator.bind(this)
      };
    }

    return config;
  }

  validator(ctx: KoaContextWithOIDC, key: string, value: any) {
    if (key === "redirect_uris") {
      for (const redirectUri of value) {
        if (redirectUri.includes("*")) {
          const {hostname, href} = new URL(redirectUri);

          if (href.split("*").length !== 2) {
            throw new this.module.errors.InvalidClientMetadata("redirect_uris with a wildcard may only contain a single one");
          }

          if (!hostname.includes("*")) {
            throw new this.module.errors.InvalidClientMetadata("redirect_uris may only have a wildcard in the hostname");
          }

          if (!psl.get(hostname.split("*.")[1])) {
            throw new this.module.errors.InvalidClientMetadata(
              "redirect_uris with a wildcard must not match an eTLD+1 of a known public suffix domain"
            );
          }
        }
      }
    }
  }
}
