import {Configuration, registerProvider} from "@tsed/di";
import {Stripe} from "stripe";
import {StripeSettings} from "../domain/StripSettings";

registerProvider({
  provide: Stripe,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const {apiKey, webhooks, ...options} = settings.get<StripeSettings>("stripe", {} as any);

    if (apiKey) {
      return new Stripe(apiKey, {
        ...options,
        typescript: true
      });
    }

    return {};
  }
});
