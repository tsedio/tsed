import {EndpointMetadata, PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import "@tsed/stripe";
import {STRIPE_WEBHOOK_EVENT, STRIPE_WEBHOOK_SIGNATURE, WebhookEventMiddleware} from "@tsed/stripe";
import {expect} from "chai";
import {Stripe} from "stripe";

class Ctrl {
  get() {}
}

describe("WebhookEventMiddleware", () => {
  beforeEach(() =>
    PlatformTest.create({
      stripe: {
        apiKey: "the_api_key",
        apiVersion: "2020-08-27",
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
    ctx.endpoint = EndpointMetadata.get(Ctrl, "get");

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

    expect(ctx.get(STRIPE_WEBHOOK_EVENT)).to.deep.eq(payload);
    expect(ctx.get(STRIPE_WEBHOOK_SIGNATURE)).to.eq(signature);
  });
  it("should construct event based on endpoint options", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Ctrl, "get");
    ctx.endpoint = EndpointMetadata.get(Ctrl, "get");
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

    expect(ctx.get(STRIPE_WEBHOOK_EVENT)).to.deep.eq(payload);
    expect(ctx.get(STRIPE_WEBHOOK_SIGNATURE)).to.eq(signature);
  });
  it("should throw error when signature isn't valid", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Ctrl, "get");

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

    expect(actualError.message).to.deep.eq(
      "Stripe webhook error: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing, innerException: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing"
    );
  });
  it("should throw error when secret is missing", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Ctrl, "get");
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

    expect(actualError.message).to.deep.eq(
      "Missing Stripe webhooks secret key. You can get this in your dashboard. See: https://dashboard.stripe.com/webhooks."
    );
  });
});
