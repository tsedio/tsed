import {Stripe} from "stripe";

export interface StripeSettings extends Stripe.StripeConfig {
  /**
   * Stripe ApiKey
   */
  apiKey: string;
  /**
   * Webhooks settings
   */
  webhooks?: {
    /**
     * Your Webhook Signing Secret for this endpoint (e.g., 'whsec_...').
     * You can get this [in your dashboard](https://dashboard.stripe.com/webhooks).
     */
    secret: string;
    /**
     * Seconds of tolerance on timestamps.
     */
    tolerance?: number;
  };
}

declare global {
  namespace TsED {
    interface Configuration {
      stripe: StripeSettings;
    }
  }
}
