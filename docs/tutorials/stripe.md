---
meta:
  - name: description
    content: Use Stripe with Express, TypeScript and Ts.ED. The Stripe Node library provides convenient access to the Stripe API from applications written in server-side JavaScript.
  - name: keywords
    content: ts.ed express typescript stripe node.js javascript decorators
projects:
  - title: Kit Stripe
    href: https://github.com/tsedio/tsed-stripe-example
    src: /stripe.svg
---

# Stripe

<Banner src="/stripe.svg" height="200" href="https://stripe.com/docs/js"></Banner>

This tutorial shows you how you can use Stripe package with Ts.ED.

The Stripe Node library provides convenient access to the Stripe API from applications written in server-side
JavaScript.

For collecting customer and payment information in the browser, use [Stripe.js](https://stripe.com/docs/stripe.js).

<Projects type="projects"/>

## Features

Currently, [`@tsed/stripe`](https://www.npmjs.com/package/@tsed/stripe) allows you to:

- Configure Stripe,
- Create webhooks,
- Use Stripe API.

## Installation

To begin, install the Stripe module for Ts.ED:

::: code-group

```sh [npm]
npm install --save @tsed/stripe stripe
```

```sh [yarn]
yarn add @tsed/stripe stripe
```

```sh [pnpm]
pnpm add @tsed/stripe stripe
```

```sh [bun]
bun add @tsed/stripe stripe
```

:::

Then import `@tsed/stripe` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import "@tsed/stripe";
import {Stripe} from "stripe";

@Configuration({
  stripe: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhooks: {
      secret: process.env.STRIPE_WEBHOOK_SECRET
    },
    // Stripe options
    apiVersion: "2019-08-08",
    httpProxy: new ProxyAgent(process.env.http_proxy)
  }
})
export class Server {
  @Inject()
  stripe: Stripe;

  $afterInit() {
    // do something with stripe
    // this.stripe.customers
  }
}
```

::: tip
See Stripe options for more details: https://www.npmjs.com/package/stripe
:::

`STRIPE_SECRET_KEY` can be retrieved on the Stripe Dashboard here: https://dashboard.stripe.com/test/apikeys

And the `STRIPE_WEBHOOK_SECRET` can be retrieved by using the `stripe listen` or `stripe forward`:

```sh
stripe listen

> Ready! You are using Stripe API Version [2020-08-27]. Your webhook signing secret is whsec_*****************************
```

::: note
You have to install the `stripe-cli` to run `stripe listen`. See https://stripe.com/docs/stripe-cli.
:::

## Inject Stripe

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
class MyStripeService {
  @Inject()
  stripe: Stripe;

  $onInit() {
    // do something with stripe
    this.stripe.on("request", this.onRequest.bind(this));
  }

  protected onRequest(request: any) {}
}
```

## Webhook signing

Stripe can optionally sign the webhook events it sends to your endpoint, allowing you to validate that they were not
sent by a third-party. You can read more about it [here](https://stripe.com/docs/webhooks#signatures).

To register a Stripe webhook with Ts.ED, just use the @@WebhookEvent@@ decorator. It'll call for you the
`stripe.webhooks.constructEvent` with the right parameters:

```typescript
import {RawBodyParams, HeaderParams, Context} from "@tsed/platform-params";
import {Controller} from "@tsed/di";
import {Stripe} from "stripe";

@Controller("/webhooks")
export class StripWebhookCtrl {
  @Inject()
  protected stripe: Stripe;

  @Post("/callback")
  successPaymentHook(@WebhookEvent() event: Stripe.Event, @Context() ctx: Context) {
    ctx.logger.info({name: "Webhook success", event});

    return {received: true};
  }

  // with custom webhook options
  @Post("/callback2")
  successPaymentHook(@WebhookEvent({secret: "....."}) event: Stripe.Event, @Context() ctx: Context) {
    ctx.logger.info({name: "Webhook success", event});

    return {received: true};
  }
}
```

## Testing webhook

You can use stripe.webhooks.generateTestHeaderString to mock webhook events that come from Stripe:

```typescript
import {Stripe} from "stripe";
import {PlatformTest} from "@tsed/platform-http/testing";
import {StripWebhookCtrl} from "./StripWebhookCtrl";

describe("StripWebhookCtrl", () => {
  beforeEach(() =>
    PlatformTest.create({
      stripe: {
        apiKey: "fake_api_key",
        webhooks: {
          secret: "whsec_test_secret"
        },
        // Stripe options
        apiVersion: "2019-08-08"
      }
    })
  );
  afterEach(PlatformTest.reset);
  it("should call event", async () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);
    const payload = {
      id: "evt_test_webhook",
      object: "event"
    };
    const payloadString = JSON.stringify(payload, null, 2);

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: "whsec_test_secret"
    });

    const event = stripe.webhooks.constructEvent(payloadString, header, secret);
    const ctx = PlatformTest.createRequestContext();

    const ctrl = await PlatformTest.invoke<StripWebhookCtrl>(StripWebhookCtrl);

    const result = ctrl.successPaymentHook(event, ctx);

    expect(result).toEqual({received: true});
  });
});
```

With SuperTest:

```typescript
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {expect} from "chai";
import {Stripe} from "stripe";
import SuperTest from "supertest";
import {StripeWebhooksCtrl} from "./StripWebhookCtrl";
import {rootDir, Server} from "../Server";

const utils = PlatformTestUtils.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "info"
  }
});

describe("Stripe", () => {
  let request: SuperTest.Agent;
  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [StripWebhookCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });

  afterEach(() => PlatformTest.reset());

  it("should call the webhook", async () => {
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

    expect(response.body).to.deep.eq({
      event: payload,
      received: true
    });
  });
});
```

### Known issue

If you have the followings message, it means you have an issue with your STRIPE_WEBHOOK_SECRET.

```sh
Error message: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe?
```

Please double-check your configuration!

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
