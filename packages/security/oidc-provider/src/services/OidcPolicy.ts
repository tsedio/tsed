import {inject, Injectable, injector, Provider} from "@tsed/di";
import {interactionPolicy} from "oidc-provider";

import {InteractionMethods} from "../domain/InteractionMethods.js";
import {OidcInteractionOptions} from "../domain/OidcInteractionOptions.js";
import {OidcInteractions} from "./OidcInteractions.js";
import Prompt = interactionPolicy.Prompt;

@Injectable()
export class OidcPolicy {
  protected injector = injector();
  protected oidcInteractions = inject(OidcInteractions);

  public getPolicy() {
    let policy = interactionPolicy.base();
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

      // reordering interactions by interactions index
      if (!usePriority) {
        policy = policy.sort((a, b) => {
          const o1 = interactions.get(a.name)?.order || 0;
          const o2 = interactions.get(b.name)?.order || 0;

          return o1 < o2 ? -1 : 1;
        });
      }
    }

    return this.injector.alter("$alterOidcPolicy", policy);
  }

  public createPrompt(instance: InteractionMethods, options: OidcInteractionOptions): Prompt {
    const {checks: originalChecks = [], details, ...promptOptions} = options;
    const checks = [...(instance.checks ? instance.checks() : originalChecks)].filter(Boolean);

    return new interactionPolicy.Prompt(promptOptions, instance.details ? instance.details.bind(instance) : details, ...checks);
  }

  private getInteractions() {
    let usePriority = false;

    const interactions = this.oidcInteractions.getInteractions();

    const map = interactions.reduce(
      (map, provider, index) => {
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
      },
      new Map<
        string,
        {
          order: number;
          provider: Provider;
          instance: any;
          options: OidcInteractionOptions;
          name: string;
        }
      >()
    );

    return {
      interactions: map,
      usePriority
    };
  }
}
