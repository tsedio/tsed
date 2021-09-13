import {Constant, EndpointMetadata, PlatformContext, PlatformHandler, Provider, TokenProvider} from "@tsed/common";
import {Env} from "@tsed/core";
import {Inject, Injectable, InjectorService} from "@tsed/di";
import {INTERACTION, INTERACTION_OPTIONS, INTERACTIONS} from "../constants";
import {OidcInteractionOptions, OidcSettings} from "../domain";

@Injectable()
export class OidcInteractions {
  @Inject()
  injector: InjectorService;

  @Constant("env")
  env: Env;

  @Constant("oidc")
  oidcSettings: OidcSettings;

  protected interactions: Map<string, Provider> = new Map();

  $onInit(): void {
    const platformHandler = this.injector.get<PlatformHandler>(PlatformHandler)!;

    this.getInteractions().forEach((provider: Provider) => {
      const {name} = provider.store.get<OidcInteractionOptions>(INTERACTION_OPTIONS);
      this.interactions.set(name, provider);

      if (provider.instance.$prompt) {
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
      .map((token: TokenProvider) => this.injector.getProvider(token))
      .filter((provider: Provider) => provider?.subType === INTERACTION);
  }

  getInteractionProvider(name: string): Provider | undefined {
    return this.interactions.get(name);
  }

  getInteractionHandler(name: string) {
    const interaction = this.getInteractionProvider(name);

    if (interaction) {
      return (ctx: PlatformContext) => {
        // Add current endpoint metadata to ctx
        ctx.endpoint = EndpointMetadata.get(interaction.useClass, "$prompt");

        return interaction.store.get("$prompt")(ctx);
      };
    }
  }
}
