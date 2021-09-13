import {Constant, Context, HeaderParams, Inject, Middleware, MiddlewareMethods, RawBodyParams} from "@tsed/common";
import {BadRequest, InternalServerError} from "@tsed/exceptions";
import {Stripe} from "stripe";
import {STRIPE_WEBHOOK_EVENT, STRIPE_WEBHOOK_SIGNATURE} from "../constants";
import "../services/StripeFactory";

export interface WebhookEventOptions {
  secret: string;
  tolerance: number;
}

@Middleware()
export class WebhookEventMiddleware implements MiddlewareMethods {
  @Inject()
  protected stripe: Stripe;

  @Constant("stripe.webhooks")
  protected webhooks: WebhookEventOptions;

  use(@HeaderParams("stripe-signature") signature: string, @RawBodyParams() body: Buffer, @Context() ctx: Context): any {
    const {secret, tolerance}: WebhookEventOptions = {
      ...this.webhooks,
      ...ctx.endpoint.store.get(WebhookEventMiddleware)
    };

    if (!secret) {
      throw new InternalServerError(
        "Missing Stripe webhooks secret key. You can get this in your dashboard. See: https://dashboard.stripe.com/webhooks."
      );
    }

    try {
      ctx.set(STRIPE_WEBHOOK_SIGNATURE, signature);
      ctx.set(STRIPE_WEBHOOK_EVENT, this.stripe.webhooks.constructEvent(body, signature, secret, tolerance));
    } catch (err) {
      throw new BadRequest(`Stripe webhook error: ${err.message}`, err);
    }
  }
}
