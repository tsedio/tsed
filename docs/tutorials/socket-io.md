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

```bash
npm install --save socket.io @types/socket.io @tsed/socketio
npm install --save-dev @tsed/socketio-testing
```

Then add the following configuration in your server [Configuration](/docs/configuration.md):

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

All Socket service work under a namespace and you can create one Socket service per namespace.

Example:

<<< @/tutorials/snippets/socketio/socket-service.ts

> @@SocketService@@ inherits from @@Service@@ decorator, meaning a SocketService can be injected to another Service, Controller or Middleware.

Example:

<<< @/tutorials/snippets/socketio/socket-service-nsp.ts

Then, you can inject your socket service into another Service, Controller, etc. as following:

<<< @/tutorials/snippets/socketio/socket-service-di.ts

### Declaring an Input Event

@@Input@@ decorator declares a method as a new handler for a specific `event`.

<<< @/tutorials/snippets/socketio/socket-input-event.ts

- @@Args@@ &lt;any|any[]&gt;: List of the parameters sent by the input event.
- @@Socket@@ &lt;SocketIO.Socket&gt;: Socket instance.
- @@Namespace@@ &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.
- @@Nps@@ &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.

### Send a response

You have many choices to send a response to your client. Ts.ED offers some decorators to send a response:

<img alt="socketio" src="./../assets/socketio.png" style="max-width: 100%" />

Example:

<<< @/tutorials/snippets/socketio/socket-send-response.ts

::: tip
All methods accept a promise as returned value. Ts.ED handles promise before returning a response to your consumer.
:::

::: warning
Return value is only possible when the method is decorated by @@Emit@@, @@Broadcast@@ and @@BroadcastOthers@@.
:::

### Socket Session

Ts.ED creates a new session for each socket.

<<< @/tutorials/snippets/socketio/socket-session.ts

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

<Tabs class="-code">
  <Tab label="Jest">

```typescript
import {Inject, PlatformTest} from "@tsed/common";
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
      platform: PlatformExpress,
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

</Tab>
  <Tab label="Mocha">

```typescript
import {Inject, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Emit, Input, SocketIOServer, SocketService, SocketSession, SocketUseBefore} from "@tsed/socketio";
import {SocketClientService} from "@tsed/socketio-testing";
import {expect} from "chai";
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
  before(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress,
      listen: true,
      httpPort: 8999,
      imports: [TestWS]
    })
  );
  after(PlatformTest.reset);

  describe("RoomWS: eventName", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");
      const client2 = await service.get("/test");

      expect(client).to.eq(client2);

      return new Promise((resolve) => {
        client.on("output:scenario1", (result) => {
          expect(result).to.eq("My message");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });
});
```

</Tab>
</Tabs>

## Author

<GithubContributors users="['Romakita', 'superkaleider']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors users="['Romakita']"/>
