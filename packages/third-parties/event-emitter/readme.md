<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
 
   <h1>Event Emitter</h1>
 
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

A package of Ts.ED framework. See website: https://tsed.io

## Feature

EventEmitter module (`@tsed/event-emitter`) allows you to subscribe and listen
for various events that occur in your application based on methods decorated by
`@OnEvent` and `@OnAny`. Events can be emitted via the `EventEmitterService`.

Events serve as a great way to decouple various aspects of your application,
since a single event can have multiple listeners that do not depend on each
other. For example, you may wish to send a Slack notification to your user each
time an order has shipped. Instead of coupling your order processing code to
your Slack notification code, you can raise an OrderShipped event, which a
listener can receive and transform into a Slack notification.

The module internally uses the eventemitter2 package. For more information look at the documentation [here](https://github.com/EventEmitter2/EventEmitter2);

## Installation

To begin, install the EventEmitter module for Ts.ED:

```bash
npm install --save @tsed/event-emitter
npm install --save eventemitter2
```

## Configure your server

Import `@tsed/event-emitter` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/event-emitter"; // import event emitter ts.ed module

@Configuration({
  eventEmitter: {
    enabled: true, // Enable events for this instance.
    // pass any options that you would normally pass to new EventEmitter2(), e.g.
    wildcard: true
  }
})
export class Server {}
```

## Setup event listener

Decorate any method within a Provider (like `@Injectable`, `@Service`,
`@Controller`) with the `@OnEvent` or `@OnAny` decorator. Make sure the class
is imported somewhere or the Provider will not be registered.

```typescript
import {Injectable} from "@tsed/di";
import {OnEvent} from "@tsed/event-emitter";

interface OrderShippedEvent {
  orderId: string;
}

@Injectable()
export class SlackNotificationService {
  @OnEvent("order.shipped", {
    /* optional: add any option you would normally pass to emitter.on("order.shipped", options) */
  })
  sendOrderNotification(event: OrderShippedEvent) {
    // implement something here
  }
}
```

## Inject EventEmitter

Inject the EventEmitterService instance to interact with it directly, e.g. to emit an event.

```typescript
import {Service, Inject} from "@tsed/di";
import {EventEmitterService} from "@tsed/event-emitter";

@Service()
export class OrderService {
  @Inject()
  private eventEmitter: EventEmitterService;

  shipIt(orderId: string) {
    // do something ...
    // then send an event
    this.eventEmitter.emit("order.shipped", {orderId});
  }
}
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

Copyright (c) 2016 - 2021 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
