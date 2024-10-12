<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Server-sent events</h1>

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

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/server-sent-events

Server-sent events let you push data to the client. It's a simple way to send data from the server to the client. The data is sent as a stream of messages, with an optional event name and id. It's a simple way to send data from the server to the client.

## Installation

Before using the Server-sent events, we need to install the `@tsed/sse` module.

```bash
npm install --save @tsed/sse
```

Then add the following configuration in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/sse"; // import sse Ts.ED module

@Configuration({
  acceptMimes: ["application/json", "text/event-stream"]
})
export class Server {}
```

::: warning
There is a known issue with the `compression` middleware. The
`compression` middleware should be disabled to work correctly with Server-sent events.
:::

## Features

- Support decorator usage to enable event-stream on an endpoint,
- Support Node.js stream like `EventEmmiter` to emit events from your controller to your consumer,
- Support `Observable` from `rxjs` to emit events from your controller to your consumer.
- Support `@tsed/json-mapper` to serialize your model before sending it to the client.
- Gives an API compatible with Express.js and Koa.js.

## Enable event-stream

To enable the event-stream on an endpoint, you need to use the `@EventStream()` decorator on a method of a controller.

```typescript
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {EventStream, EventStreamCtx} from "@tsed/sse";

@Controller("/sse")
export class MyCtrl {
  @Get("/events")
  @EventStream()
  events(@EventStreamCtx() eventStream: EventStreamCtx) {
    let intervalId: ReturnType<typeof setInterval>;

    eventStream.on("close", () => {
      clearInterval(intervalId);
    });

    eventStream.on("end", () => {
      clearInterval(intervalId);
    });

    intervalId = setInterval(() => {
      // Ts.ED support Model serialization using json-mapper here
      eventStream.emit("event", new Date());
    }, 1000);
  }
}
```

### Stream events

You can use Node.js stream like `EventEmmiter` to emit events from your controller to your consumer:

```ts
import {EventStream} from "@tsed/sse";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/sse")
export class MyCtrl {
  private eventEmitter = new EventEmitter();

  $onInit() {
    setInterval(() => {
      this.eventEmitter.emit("message", new Date());
    }, 1000);
  }

  @Get("/events")
  @EventStream()
  events() {
    return this.eventEmitter;
  }
}
```

### Observable

You can also use `Observable` from `rxjs` to emit events from your controller to your consumer:

```ts
import {EventStream} from "@tsed/sse";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/sse")
export class MyCtrl {
  @Get("/events")
  @EventStream()
  events() {
    const observable = new Observable((observer) => {
      setInterval(() => {
        observer.next(new Date());
      }, 1000);
    });

    return observable;
  }
}
```

## Documentation

See our documentation https://tsed.io/#/api/index

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - today Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
