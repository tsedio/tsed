import type {PlatformContext, Provider, TokenProvider} from "@tsed/common";
import {Constant, EndpointMetadata, PlatformHandler} from "@tsed/common";
import type {Env} from "@tsed/core";
import {Inject, Injectable, InjectorService} from "@tsed/di";

import {INTERACTION, INTERACTION_OPTIONS, INTERACTIONS} from "../constants/constants.js";
import type {OidcInteractionOptions} from "../domain/OidcInteractionOptions.js";
import type {OidcSettings} from "../domain/OidcSettings.js";

@Injectable()
export class OidcInteractions {
  @Inject(InjectorService)
  protected injector: InjectorService;

  @Constant("env")
  protected env: Env;

  @Constant("oidc")
  protected oidcSettings: OidcSettings;

  protected interactions: Map<string, Provider> = new Map();

  $onInit(): void {
    const platformHandler = this.injector.get<PlatformHandler>(PlatformHandler)!;

    this.getInteractions().forEach((provider: Provider) => {
      const {name} = provider.store.get<OidcInteractionOptions>(INTERACTION_OPTIONS);
      this.interactions.set(name, provider);

      if (this.injector.get(provider.token)?.$prompt) {
        provider.store.set("$prompt", platformHandler.createCustomHandler(provider, "$prompt"));
      }
    });
  }

  getInteractions(): Provider[] {
    const interactionsProvider = this.injector.getProviders().find((provider) => provider.subType === INTERACTIONS);

    /* istanbul ignore next */
    if (!interactionsProvider) {
      return [];
    }

    return interactionsProvider.children
      .map((token: TokenProvider) => this.injector.getProvider(token)!)
      .filter((provider: Provider) => provider?.subType === INTERACTION);
  }

  getInteractionProvider(name: string): Provider | undefined {
    return this.interactions.get(name);
  }

  getInteractionHandler(name: string) {
    const interaction = this.getInteractionProvider(name);

    if (interaction) {
      const endpoint = EndpointMetadata.get(interaction.useClass, "$prompt");
      return (ctx: PlatformContext) => {
        // Add current endpoint metadata to ctx
        ctx.endpoint = endpoint;
        return interaction.store.get("$prompt")(ctx);
      };
    }
  }
}
