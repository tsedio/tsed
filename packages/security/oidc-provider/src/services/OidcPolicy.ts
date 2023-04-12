import {Inject, Injectable, InjectorService, Provider} from "@tsed/di";
// @ts-ignore
import {interactionPolicy} from "oidc-provider";
import {InteractionMethods} from "../domain/InteractionMethods";
import {OidcInteractionOptions} from "../domain/OidcInteractionOptions";
import {OidcInteractions} from "./OidcInteractions";
import {OIDC_PROVIDER_NODE_MODULE} from "./OidcProviderNodeModule";
import Prompt = interactionPolicy.Prompt;

@Injectable()
export class OidcPolicy {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected oidcInteractions: OidcInteractions;

  constructor(@Inject(OIDC_PROVIDER_NODE_MODULE) protected module: OIDC_PROVIDER_NODE_MODULE) {}

  public getPolicy() {
    let policy = this.module.interactionPolicy.base();
    const {usePriority, interactions} = this.getInteractions();

    if (interactions.size) {
      for (const {name, instance, options} of interactions.values()) {
        if (!policy.get(name)) {
          const prompt = this.createPrompt(instance, options);

          policy.add(prompt, options.priority);
        }

        if (instance.$onCreate) {
          instance.$onCreate(policy.get(name)!);
        }
      }
      console.log(usePriority);
      // reordering interactions by interactions index
      if (!usePriority) {
        policy = policy.sort((a, b) => (interactions.get(a.name)!.order < interactions.get(b.name)!.order ? -1 : 1));
      }
    }

    return this.injector.alter("$alterOidcPolicy", policy);
  }

  public createPrompt(instance: InteractionMethods, options: OidcInteractionOptions): Prompt {
    const {checks: originalChecks = [], details, ...promptOptions} = options;
    const checks = [...(instance.checks ? instance.checks() : originalChecks)].filter(Boolean);

    return new this.module.interactionPolicy.Prompt(promptOptions, instance.details ? instance.details.bind(instance) : details, ...checks);
  }

  private getInteractions() {
    let usePriority = false;

    const interactions = this.oidcInteractions.getInteractions();

    const map = interactions.reduce((map, provider, index) => {
      const instance = this.injector.get<InteractionMethods>(provider.token)!;

      const options = provider.store.get("interactionOptions");

      if (options.priority !== undefined) {
        usePriority = true;
      }

      return map.set(options.name, {
        order: index,
        name: options.name,
        provider,
        instance,
        options
      });
    }, new Map<string, {order: number; provider: Provider; instance: any; options: OidcInteractionOptions; name: string}>());

    return {
      interactions: map,
      usePriority
    };
  }
}
