import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Stripe} from "stripe";
import SuperTest from "supertest";

import {StripeWebhooksCtrl} from "./app/controllers/rest/StripeWebhooksCtrl.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("Stripe", () => {
  let request: SuperTest.Agent;
  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [StripeWebhooksCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });

  afterEach(() => PlatformTest.reset());

  it("should call the webhook from server options", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secret"
    });

    const response = await request.post("/rest/webhooks/callback").send(payloadString).set("stripe-signature", signature).expect(200);

    expect(response.body).toEqual({
      event: payload,
      received: true
    });
  });
  it("should call the webhook from endpoint configured options", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secret1"
    });

    const response = await request.post("/rest/webhooks/callback2").send(payloadString).set("stripe-signature", signature).expect(200);

    expect(response.body).toEqual({
      event: payload,
      received: true
    });
  });
  it("should throw error", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "bad_secret"
    });

    const response = await request.post("/rest/webhooks/callback").send(payloadString).set("stripe-signature", signature).expect(400);

    expect(response.body).toEqual({
      errors: [],
      message:
        "Stripe webhook error: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing, innerException: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing",
      name: "Error",
      status: 400
    });
  });
});
