import {Constant, Context, HeaderParams, Inject, Middleware, MiddlewareMethods, RawBodyParams} from "@tsed/common";
import {BadRequest, InternalServerError} from "@tsed/exceptions";
import {Stripe} from "stripe";
import {STRIPE_WEBHOOK_EVENT, STRIPE_WEBHOOK_SIGNATURE} from "../constants";
import "../services/StripeFactory";

@Middleware()
export class WebhookEventMiddleware implements MiddlewareMethods {
  @Inject()
  protected stripe: Stripe;

  @Constant("stripe.webhooks.secret")
  protected secret: string;

  @Constant("stripe.webhooks.tolerance")
  protected tolerance: number;

  use(@HeaderParams("stripe-signature") signature: string, @RawBodyParams() body: Buffer, @Context() ctx: Context): any {
    console.log(signature, typeof body, this.secret);
    // istanbul ignore next
    if (!this.secret) {
      throw new InternalServerError(
        "Missing Stripe webhooks secret key. You can get this in your dashboard. See: https://dashboard.stripe.com/webhooks."
      );
    }

    try {
      ctx.set(STRIPE_WEBHOOK_SIGNATURE, signature);
      ctx.set(STRIPE_WEBHOOK_EVENT, this.stripe.webhooks.constructEvent(body, signature, this.secret, this.tolerance));
    } catch (err) {
      throw new BadRequest(`Stripe webhook error: ${err.message}`, err);
    }
  }
}
