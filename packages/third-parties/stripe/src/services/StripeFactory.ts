import {Configuration, registerProvider} from "@tsed/di";
import {Stripe} from "stripe";
import {StripeSettings} from "../domain/StripeSettings";

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
