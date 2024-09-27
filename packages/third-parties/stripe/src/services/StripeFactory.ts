import {Configuration, registerProvider} from "@tsed/di";
import {Stripe} from "stripe";

import type {StripeSettings} from "../domain/StripeSettings.js";

export const StripeFactory = Stripe;

registerProvider({
  provide: Stripe,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const {apiKey, webhooks, ...options} = settings.get<StripeSettings>("stripe", {} as any);

    settings.set("rawBody", true);

    if (apiKey) {
      return new Stripe(apiKey, {
        ...options,
        typescript: true
      });
    }

    return {};
  }
});
