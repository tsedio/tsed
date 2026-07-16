import "../index.js";
import {STRIPE_WEBHOOK_EVENT, STRIPE_WEBHOOK_SIGNATURE} from "../constants/constants.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Stripe} from "stripe";
import {WebhookEventMiddleware} from "./WebhookEventMiddleware.js";
import {catchError} from "@tsed/core";
import {s} from "@tsed/schema";

class Ctrl {
  get() {}
}

describe("WebhookEventMiddleware", () => {
  beforeEach(() =>
    PlatformTest.create({
      stripe: {
        apiKey: "the_api_key",
        apiVersion: "2025-02-24.acacia",
        webhooks: {
          secret: "whsec_test_secret",
          tolerance: 1
        }
      }
    })
  );
  afterEach(PlatformTest.reset);

  it("should construct event", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = s.store.method(Ctrl, "get");

    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secret"
    });

    const middleware = await PlatformTest.invoke<WebhookEventMiddleware>(WebhookEventMiddleware);

    middleware.use(signature, Buffer.from(payloadString), ctx);

    expect(ctx.get(STRIPE_WEBHOOK_EVENT)).toEqual(payload);
    expect(ctx.get(STRIPE_WEBHOOK_SIGNATURE)).toEqual(signature);
  });
  it("should construct event based on endpoint options", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = s.store.method(Ctrl, "get");
    ctx.endpoint = s.store.method(Ctrl, "get");
    ctx.endpoint.store.set(WebhookEventMiddleware, {
      secret: "whsec_test_secret1"
    });

    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secret1"
    });

    const middleware = await PlatformTest.invoke<WebhookEventMiddleware>(WebhookEventMiddleware);

    middleware.use(signature, Buffer.from(payloadString), ctx);

    expect(ctx.get(STRIPE_WEBHOOK_EVENT)).toEqual(payload);
    expect(ctx.get(STRIPE_WEBHOOK_SIGNATURE)).toEqual(signature);
  });
  it("should throw error when signature isn't valid", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = s.store.method(Ctrl, "get");

    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secretooo"
    });

    const middleware = await PlatformTest.invoke<WebhookEventMiddleware>(WebhookEventMiddleware);

    const actualError: any = catchError(() => middleware.use(signature, Buffer.from(payloadString), ctx));

    expect(actualError.message).toEqual(
      `Stripe webhook error: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? 
 If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.

Learn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature
, innerException: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? 
 If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.

Learn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature`
    );
  });
  it("should throw error when secret is missing", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = s.store.method(Ctrl, "get");
    ctx.endpoint.store.set(WebhookEventMiddleware, {
      secret: null
    });
    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secretooo"
    });

    const middleware = await PlatformTest.invoke<WebhookEventMiddleware>(WebhookEventMiddleware);

    const actualError: any = catchError(() => middleware.use(signature, Buffer.from(payloadString), ctx));

    expect(actualError.message).toEqual(
      "Missing Stripe webhooks secret key. You can get this in your dashboard. See: https://dashboard.stripe.com/webhooks."
    );
  });
});
