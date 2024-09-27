import {Controller, Post} from "@tsed/common";
import type Stripe from "stripe";

import {WebhookEvent} from "../../../../src/index.js";

@Controller("/webhooks")
export class StripeWebhooksCtrl {
  @Post("/callback")
  protected successPaymentHook(@WebhookEvent() event: Stripe.Event) {
    return {
      received: true,
      event
    };
  }

  @Post("/callback2")
  protected successPaymentHook2(@WebhookEvent({secret: "whsec_test_secret1"}) event: Stripe.Event) {
    return {
      received: true,
      event
    };
  }
}
