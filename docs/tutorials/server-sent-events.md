---
meta:
  - name: description
    content: Guide to implement Server-sent events with Ts.ED.
  - name: keywords
    content: ts.ed express typescript sse server-sent events node.js javascript decorators
---

# Server-sent events

Server-sent events let you push data to the client. It's a simple way to send data from the server to the client. The data is sent as a stream of messages, with an optional event name and id. It's a simple way to send data from the server to the client.

## Installation

Before using the Server-sent events, we need to install the `@tsed/sse` module.

<Tabs class="-code">
  <Tab label="npm">

```bash
npm install --save @tsed/sse
```

 </Tab>

  <Tab label="yarn">

```bash
yarn add --save @tsed/sse
```

 </Tab>
  <Tab label="pnpm">

```bash
pnpm add --save @tsed/sse
```

 </Tab>
  <Tab label="bun">

```bash
bun add --save @tsed/sse
```

 </Tab>
</Tabs>

Then add the following configuration in your Server:

```typescript
import {Configuration} from "@tsed/common";
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
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {EventStream} from "@tsed/sse";
import {Observable} from "rxjs";

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

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
