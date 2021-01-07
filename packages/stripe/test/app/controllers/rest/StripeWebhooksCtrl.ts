import {Controller, Post} from "@tsed/common";
import {WebhookEvent} from "@tsed/stripe";
import Stripe from "stripe";

@Controller("/webhooks")
export class StripeWebhooksCtrl {

  @Post("/callback")
  protected successPaymentHook(
    @WebhookEvent() event: Stripe.Event
  ) {
    return {
      received: true,
      event
    };
  }
}