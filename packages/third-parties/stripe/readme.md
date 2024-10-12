<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Stripe</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.io/tutorials/stripe.html

## Feature

Currently, `@tsed/stripe` allows you:

- Configure stripe,
- Create webhooks,
- Use stripe API.

## Installation

To begin, install the Stripe module for TS.ED:

```bash
npm install --save @tsed/stripe
npm install --save stripe
```

Then import `@tsed/stripe` in your Server:

```typescript
import {PlatformApplication} from "@tsed/platform-http";
import {Configuration} from "@tsed/di";
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

> See Stripe options for more details: https://www.npmjs.com/package/stripe

::: warning
Stripe needs to validate signature transaction when you received a webhook notification.
To work properly, you have to remove bodyParser add on `$beforeRoutesInit`.

```diff
@Configuration({
+  rawBody: true,
+  middlewares: [
+     {use: 'json-parser'},
+     {use: 'urlencoded-parser', options: {extended: true})
+  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  $beforeRoutesInit() {
-    this.app
-      .use(bodyParser.json())
-      .use(bodyParser.urlencoded({extended: true}));
  }
}
```

::

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

Stripe can optionally sign the webhook events it sends to your endpoint, allowing you to validate that they were not sent by a third-party. You can read more about it [here](https://stripe.com/docs/webhooks#signatures).

To register a Stripe webhook with Ts.ED, just use the `@WebhookEvent` decorator. It'll call for you the `stripe.webhooks.constructEvent` with the right parameters:

```typescript
import {RawBodyParams, HeaderParams, Context} from "@tsed/platform-params";
import {Controller} from "@tsed/di";
import {Stripe} from "stripe";

@Controller("/webhooks")
export class StripWebhookCtrl {
  @Inject()
  stripe: Stripe;

  @Post("/callback")
  successPaymentHook(@WebhookEvent() event: Stripe.Event, @Context() ctx: Context) {
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
import {StripWebhookCtrl} from "./StripWebhookCtrl.js";

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
import {StripeWebhooksCtrl} from "./StripWebhookCtrl.js";
import {Server} from "../Server.js";

const utils = PlatformTestUtils.create({
  platform: PlatformExpress,
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

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
