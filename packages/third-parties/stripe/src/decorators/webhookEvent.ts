import {Context, UseBefore} from "@tsed/common";
import {StoreSet, useDecorators, useMethodDecorators} from "@tsed/core";
import {In} from "@tsed/schema";
import {STRIPE_WEBHOOK_EVENT} from "../constants/constants";
import {WebhookEventMiddleware, WebhookEventOptions} from "../middlewares/WebhookEventMiddleware";

/**
 * Get the stripe webhook event.
 *
 * @decorator
 * @operation
 * @input
 */
export function WebhookEvent(options?: Partial<WebhookEventOptions>) {
  return useDecorators(
    useMethodDecorators(
      In("body").Type(Object).Required().Description("The raw webhook payload"),
      In("header").Name("stripe-signature").Type(String).Required().Description("The stripe webhook signature"),
      StoreSet(WebhookEventMiddleware, options),
      UseBefore(WebhookEventMiddleware)
    ),
    Context(STRIPE_WEBHOOK_EVENT)
  );
}
