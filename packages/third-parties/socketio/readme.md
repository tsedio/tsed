<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Socket.io</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![Coverage Status](https://coveralls.io/repos/github/tsedio/tsed/badge.svg?branch=production)](https://coveralls.io/github/tsedio/tsed?branch=production)
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

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/socket-io

Socket.io enable real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.

## Installation

Before using the Socket.io, we need to install the [Socket.io](https://www.npmjs.com/package/socket.io) module.

```bash
npm install --save socket.io @types/socket.io @tsed/socketio
```

Then add the following configuration in your Server:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/socketio"; // import socketio Ts.ED module
import {resolve} from "path";

@Configuration({
  socketIO: {
    // ... see configuration
  }
})
export class Server {}
```

## Socket Service

> Socket.IO allows you to “namespace” your sockets, which essentially means assigning different endpoints or paths.
> This is a useful feature to minimize the number of resources (TCP connections) and at the same time separate concerns within your application
> by introducing separation between communication channels. See [namespace documentation](https://socket.io/docs/rooms-and-namespaces/#).

All Socket service work under a namespace and you can create one Socket service per namespace.

Example:

```typescript
import * as SocketIO from "socket.io";
import {SocketService, IO, Nsp, Socket, SocketSession, Reason} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Nsp nsp: SocketIO.Namespace;

  @Nsp("/my-other-namespace")
  nspOther: SocketIO.Namespace; // communication between two namespace

  constructor(@IO private io: SocketIO.Server) {}
  /**
   * Triggered the namespace is created
   */
  $onNamespaceInit(nsp: SocketIO.Namespace) {}
  /**
   * Triggered when a new client connects to the Namespace.
   */
  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {}
  /**
   * Triggered when a client disconnects from the Namespace.
   */
  $onDisconnect(@Socket socket: SocketIO.Socket, @Reason reason: string) {}
}
```

> @SocketService inherit from @Service decorator. That means, a SocketService can be injected to another Service, Controller or Middleware.

Example:

```typescript
import * as SocketIO from "socket.io";
import {SocketService, Nsp} from "@tsed/socketio";

@SocketService()
export class MySocketService {
  @Nsp nsp: SocketIO.Namespace;

  helloAll() {
    this.nsp.emit("hi", "everyone!");
  }
}
```

Then, you can inject your socket service into another Service, Controller, etc... as following:

```typescript
import {Controller, Get} from "@tsed/common";
import {MySocketService} from "../services/MySocketService";

@Controller("/")
export class MyCtrl {
  constructor(private mySocketService: MySocketService) {}

  @Get("/allo")
  allo() {
    this.mySocketService.helloAll();
    return "is sent";
  }
}
```

### Declaring an Input Event

@Input decorator declare a method as a new handler for a specific `event`.

```typescript
import {SocketService, Input, Emit, Args, Socket, Nsp} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
    console.log(userName);
  }
}
```

- @Args &lt;any|any[]&gt;: List of the parameters sent by the input event.
- @Socket &lt;SocketIO.Socket&gt;: Socket instance.
- @Nsp &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.

### Send a response

You have a many choice to send a response to your client. Ts.ED offer some decorators to send a response:

![socketio](https://tsed.io/socketio.png)

Example:

```typescript
import {SocketService, Input, Emit, Args, Socket, Nsp} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  async myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket) {
    return "Message " + userName;
  }
}
```

> The method accept a promise as returned value.

::: warning
Return value is only possible when the method is decorated by [@Emit](https://tsed.io/api/socketio/emit.html), [@Broadcast](https://tsed.io/api/socketio/broadcast.html) and [@BroadcastOthers](https://tsed.io/api/socketio/broadcastothers.html).
:::

### Socket Session

Ts.ED create a new session for each socket.

```typescript
import {SocketService, Input, Emit, Args, SocketSession} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  async myMethod(@Args(0) userName: string, @SocketSession session: SocketSession) {
    const user = session.get("user") || {};
    user.name = userName;

    session.set("user", user);

    return user;
  }
}
```

The session represents an arbitrary object that facilitates the storage of session data, allowing the sharing of information between Socket.IO servers.

In the event of an unexpected disconnection (i.e., when the socket is not manually disconnected using `socket.disconnect()`), the server will store the session of the socket. Upon reconnection, the server will make an attempt to restore the previous session.

To enable this behavior, you need to configure the [Connection state recovery](https://socket.io/docs/v4/connection-state-recovery) as follows:

```ts
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/socketio";

@Configuration({
  socketIO: {
    // ... see configuration
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true
    }
  }
})
export class Server {}
```

> By default, Ts.ED uses the built-in in-memory adapter for session management. However, for production environments, it is recommended to use [the persistent adapters](https://socket.io/docs/v4/connection-state-recovery#compatibility-with-existing-adapters) to enhance reliability.

### Middlewares

A middleware can be also used on a `SocketService` either on a class or on a method.

Here an example of a middleware:

```typescript
import {deserialize} from "@tsed/json-mapper";
import {SocketMiddleware, Args} from "@tsed/socketio";
import {User} from "../models/User";

@SocketMiddleware()
export class UserConverterSocketMiddleware {
  async use(@Args() args: any[]) {
    let [user] = args;
    // update Arguments
    user = deserialize(user, {type: User});

    return [user];
  }
}
```

> The user instance will be forwarded to the next middleware and to your decorated method.

You can also declare a middleware to handle an error with `@SocketMiddlewareError`.
Here an example:

```typescript
import {SocketMiddlewareError, SocketErr, Socket} from "@tsed/socketio";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  async use(@SocketErr err: any, @Socket socket: SocketIO.Socket) {
    console.error(err);
    socket.emit("error", {message: "An error has occured"});
  }
}
```

Then, two decorators are provided to attach your middleware on the right place:

- `@SocketUseBefore` will call your middleware before the class method,
- `@SocketUseAfter` will call your middleware after the class method.

Both decorators can be used as a class decorator or as a method decorator.
The call sequences is the following for each event request:

- Middlewares attached with `@SocketUseBefore` on class,
- Middlewares attached with `@SocketUseBefore` on method,
- The method,
- Send response if the method is decorated with `@Emit`, `@Broadcast` or `@BroadcastOther`,
- Middlewares attached with `@SocketUseAfter` on method,
- Middlewares attached with `@SocketUseAfter` on class.

Middlewares chain use the `Promise` to run it. If one of this middlewares/method emit an error, the first middleware error will be called.

```typescript
import {SocketService, SocketUseAfter, SocketUseBefore, Emit, Input, Args, SocketSession} from "@tsed/socketio";
import {UserConverterSocketMiddleware, ErrorHandlerSocketMiddleware} from "../middlewares";
import {User} from "../models/User";
import {SocketSessionData} from "@tsed/socketio/lib/cjs";

@SocketService("/my-namespace")
@SocketUseBefore(UserConverterSocketMiddleware) // global version
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  @SocketUseBefore(UserConverterSocketMiddleware)
  @SocketUseAfter(ErrorHandlerSocketMiddleware)
  async myMethod(@Args(0) userName: User, @SocketSessionData session: SocketSessionData) {
    const user = session.get("user") || {};
    user.name = userName;

    session.set("user", user);

    return user;
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

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
