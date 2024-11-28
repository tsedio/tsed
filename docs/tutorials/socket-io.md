---
meta:
  - name: description
    content: Use Socket.io with Express, TypeScript and Ts.ED. Socket.io enable real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.
  - name: keywords
    content: ts.ed express typescript socket.io websocket node.js javascript decorators
projects:
  - title: Kit Socket.io
    href: https://github.com/tsedio/tsed-example-socketio
    src: /socketio.png
---

# Socket.io

<Banner src="/socket-io.png" href="https://socket.io" height="180" style="margin-left:-40px" />

Socket.io enables real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.

<Projects type="projects"/>

## Installation

Before using Socket.io, we need to install the [Socket.io](https://www.npmjs.com/package/socket.io) module.

::: code-group

```sh [npm]
npm install --save socket.io @types/socket.io @tsed/socketio
npm install --save-dev @tsed/socketio-testing
```

```sh [yarn]
yarn add socket.io @types/socket.io @tsed/socketio
yarn add --dev @tsed/socketio-testing
```

```sh [pnpm]
pnpm add socket.io @types/socket.io @tsed/socketio
pnpm add -D @tsed/socketio-testing
```

```sh [bun]
bun add socket.io @types/socket.io @tsed/socketio
bun add --dev @tsed/socketio-testing
```

:::

Then add the following configuration in your server [Configuration](/docs/configuration/index):

<<< @/tutorials/snippets/socketio/configuration.ts

## Configuration

- `path`: name of the path to capture (/socket.io).
- `serveClient`: whether to serve the client files (true).
- `adapter`: the adapter to use. Defaults to an instance of the Adapter that ships with Socket.io which is memory based. See [socket.io-adapter](https://github.com/socketio/socket.io-adapter).
- `cors`: Cors configuration.
- `parser`: the parser to use. Defaults to an instance of the Parser that ships with Socket.io. See [socket.io-parser](https://github.com/socketio/socket.io-parser).

For more information see [Socket.io documentation](https://socket.io/docs/v4/server-api)

## Socket Service

> Socket.io allows you to “namespace” your sockets, which essentially means assigning different endpoints or paths.
> This is a useful feature to minimize the number of resources (TCP connections) and at the same time separate concerns within your application
> by introducing separation between communication channels. See [namespace documentation](https://socket.io/docs/v4/namespaces/).

All Socket service work under a namespace, and you can create one Socket service per namespace.

Example:

<<< @/tutorials/snippets/socketio/socket-service.ts

> @@SocketService@@ inherits from @@Service@@ decorator, meaning a SocketService can be injected to another Service, Controller or Middleware.

Example:

<<< @/tutorials/snippets/socketio/socket-service-nsp.ts

Then, you can inject your socket service into another Service, Controller, etc. as following:

<<< @/tutorials/snippets/socketio/socket-service-di.ts

### Dynamic Namespaces

> Socket.io [dynamic namespaces](https://socket.io/docs/v4/namespaces/#dynamic-namespaces) can be implemented using @@SocketService@@, @@Namespace@@ and @@Nsp@@

<<< @/tutorials/snippets/socketio/socket-service-dynamic-nsp.ts

### Declaring an Input Event

@@Input@@ decorator declares a method as a new handler for a specific `event`.

<<< @/tutorials/snippets/socketio/socket-input-event.ts

- @@Args@@ &lt;any|any[]&gt;: List of the parameters sent by the input event.
- @@Socket@@ &lt;SocketIO.Socket&gt;: Socket instance.
- @@Namespace@@ &lt;[SocketIO.Namespace](https://socket.io/docs/v4/namespaces/)&gt;: Namespace instance.
- @@Nsp@@ &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.
- @@SocketNsp@@ &lt;[SocketIO.Namespace](https://socket.io/docs/v4/namespaces/)&gt;: Namespace instance from socket.

### Send a response

You have many choices to send a response to your client. Ts.ED offers some decorators to send a response:

<img alt="socketio" src="./assets/socketio/socketio.png" style="max-width: 100%" />

Example:

```ts
import {Args, Emit, Input, Socket, SocketService} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  async myMethod(@Args(0) userName: string, @Socket socket: Socket) {
    return "Message " + userName;
  }
}
```

::: tip
All methods accept a promise as returned value. Ts.ED handles promise before returning a response to your consumer.
:::

::: warning
Return value is only possible when the method is decorated by @@Emit@@, @@Broadcast@@ and @@BroadcastOthers@@.
:::

Since v7.59.0, you can omit the `@Emit` decorator. Ts.ED will automatically emit the returned value using the callback function
given by Socket.io.

Example:

```ts
import {Args, Emit, Input, Socket, SocketService} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  async myMethod(@Args(0) userName: string) {
    return "Message " + userName;
  }
}
```

### Socket Session

Ts.ED creates a new session for each socket.

<<< @/tutorials/snippets/socketio/socket-session.ts

The session represents an arbitrary object that facilitates the storage of session data, allowing the sharing of information between Socket.IO servers.

In the event of an unexpected disconnection (i.e., when the socket is not manually disconnected using `socket.disconnect()`), the server will store the session of the socket. Upon reconnection, the server will make an attempt to restore the previous session.

To enable this behavior, you need to configure the [Connection state recovery](https://socket.io/docs/v4/connection-state-recovery) as follows:

<<< @/tutorials/snippets/socketio/connection-state-recovery-configuration.ts

::: tip
By default, Ts.ED uses the built-in in-memory adapter for session management. However, for production environments, it is recommended to use [the persistent adapters](https://socket.io/docs/v4/connection-state-recovery#compatibility-with-existing-adapters) to enhance reliability.
:::

### Middlewares

A middleware can also be used on a @@SocketService@@ either on a class or on a method.

Here is an example of a middleware:

<<< @/tutorials/snippets/socketio/socket-use-middleware.ts

::: tip
The user instance will be forwarded to the next middleware and to your decorated method.
:::

You can also declare a middleware to handle an error with @@SocketMiddlewareError@@.
Here is an example:

<<< @/tutorials/snippets/socketio/socket-middleware.ts

Two decorators are provided to attach your middleware on the right place:

- @@SocketUseBefore@@ will call your middleware before the class method,
- @@SocketUseAfter@@ will call your middleware after the class method.

Both decorators can be used as a class decorator or as a method decorator.
The call sequence is the following for each event request:

- Middlewares attached with @@SocketUseBefore@@ on class,
- Middlewares attached with @@SocketUseBefore@@ on method,
- The method,
- Send response if the method is decorated with @@Emit@@, @@Broadcast@@ or @@BroadcastOthers@@,
- Middlewares attached with @@SocketUseAfter@@ on method,
- Middlewares attached with @@SocketUseAfter@@ on class.

Middlewares chain uses the `Promise` to run it. If one of this middlewares/method emits an error, the first middleware error will be called.

<<< @/tutorials/snippets/socketio/socket-use-middleware2.ts

## Decorators

<ApiList query="module.match('@tsed/socketio') && symbolType === 'decorator'" />

## Connecting the client

Once you have the socket set up on the server, you will want to connect up your client. Here are a few examples based on different configurations and namespaces.

### With default config

With this in your server configuration

```typescript
@Configuration({
  socketIO: {} // uses all default values
})
```

And this in your service

<<< @/tutorials/snippets/socketio/basicSocketService.ts

In plain javascript you could connect like this.

<<< @/tutorials/snippets/socketio/basicClientSetup.html

## Testing <Badge text="v6.55.0+" />

To test your Socket.io service, you can use the `@tsed/socketio-testing` package.

::: code-group

```typescript [Jest]
import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformExpress} from "@tsed/platform-express";
import {Emit, Input, SocketIOServer, SocketService, SocketSession, SocketUseBefore} from "@tsed/socketio";
import {SocketClientService} from "@tsed/socketio-testing";
import {Namespace, Socket as IOSocket} from "socket.io";
import {Server} from "./app/Server";

@SocketService("/test")
export class TestWS {
  @Inject()
  private io: SocketIOServer;

  $onConnection(socket: IOSocket, nsp: Namespace) {}

  $onDisconnect(socket: IOSocket, nsp: Namespace) {}

  @Input("input:scenario1")
  @Emit("output:scenario1")
  async scenario1() {
    return "My message";
  }
}

describe("Socket integration", () => {
  beforeAll(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
      listen: true,
      httpPort: 8999,
      imports: [TestWS]
    })
  );
  afterAll(PlatformTest.reset);

  describe("RoomWS: eventName", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");
      const client2 = await service.get("/test");

      expect(client).toEqual(client2);

      return new Promise((resolve) => {
        client.on("output:scenario1", (result) => {
          expect(result).toEqual("My message");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });
});
```

```typescript [Vitest]
import {Inject} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformExpress} from "@tsed/platform-express";
import {Emit, Input, SocketIOServer, SocketService, SocketSession, SocketUseBefore} from "@tsed/socketio";
import {SocketClientService} from "@tsed/socketio-testing";
import {Namespace, Socket as IOSocket} from "socket.io";
import {Server} from "./app/Server.js";

@SocketService("/test")
export class TestWS {
  @Inject()
  private io: SocketIOServer;

  $onConnection(socket: IOSocket, nsp: Namespace) {}

  $onDisconnect(socket: IOSocket, nsp: Namespace) {}

  @Input("input:scenario1")
  @Emit("output:scenario1")
  async scenario1() {
    return "My message";
  }
}

describe("Socket integration", () => {
  beforeAll(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
      listen: true,
      httpPort: 8999,
      imports: [TestWS]
    })
  );
  afterAll(PlatformTest.reset);

  describe("RoomWS: eventName", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");
      const client2 = await service.get("/test");

      expect(client).toEqual(client2);

      return new Promise((resolve) => {
        client.on("output:scenario1", (result) => {
          expect(result).toEqual("My message");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });
});
```

:::

## Author

<GithubContributors users="['Romakita', 'superkaleider']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors users="['Romakita']"/>
