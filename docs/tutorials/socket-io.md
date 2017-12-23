# Socket.io
> Experimental feature. You can contribute to improve this feature !

Socket.io enable real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.

## Installation 

Before using the Socket.io, we need to install the [Socket.io](https://www.npmjs.com/package/socket.io) module.

```
npm install --save socket.io @types/socket.io
```

Then add the following configuration in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/socketio"; // import socketio Ts.ED module

@ServerSettings({
    rootDir: __dirname,
    socketIO: {
        // ... see configuration
    }
})
export class Server extends ServerLoader {

}
```

## Configuration

- `path` &lt;string&gt;: name of the path to capture (/socket.io).
- `serveClient` &lt;boolean&gt;: whether to serve the client files (true).
- `adapter` &lt;Adapter&gt;: the adapter to use. Defaults to an instance of the Adapter that ships with socket.io which is memory based. See [socket.io-adapter](https://github.com/socketio/socket.io-adapter).
- `origins` &lt;string&gt;: the allowed origins (*).
- `parser` &lt;Parser&gt;: the parser to use. Defaults to an instance of the Parser that ships with socket.io. See [socket.io-parser](https://github.com/socketio/socket.io-parser).

For more information see [Socket.io documentation](https://socket.io/docs/server-api/#)

## Socket Service

> Socket.IO allows you to “namespace” your sockets, which essentially means assigning different endpoints or paths. 
This is a useful feature to minimize the number of resources (TCP connections) and at the same time separate concerns within your application
 by introducing separation between communication channels. See [namespace documentation](https://socket.io/docs/rooms-and-namespaces/#).

All Socket service work under a namespace and you can create one Socket service per namespace.

Example:

```typescript
import * as SocketIO from "socket.io";
import {SocketService, IO, Nsp, Socket, SocketSession} from "ts-express-decorators/socketio";

@SocketService("/my-namespace") 
export class MySocketService {
    
    @Nsp nsp: SocketIO.Namespace;
    
    constructor(@IO private io: SocketIO.Server) {}
    /**
     * Triggered the namespace is created
     */
    $onNamespaceInit(nsp: SocketIO.Namespace) {
    
    }
    /**
     * Triggered when a new client connects to the Namespace. 
     */
    $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    
    }
    /**
     * Triggered when a client disconnects from the Namespace.
     */
    $onDisconnect(@Socket socket: SocketIO.Socket) {

    }
}
```

> @SocketService inherit from @Service decorator. That means, a SocketService can be injected to another Service, Controller or Middleware.

### Declaring an Input Event

[@Input](api/socketio/input.md) decorator declare a method as a new handler for a specific `event`. 

```typescript
@SocketService("/my-namespace") 
export class MySocketService {
    @Input("eventName")
    myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
        console.log(userName);
    }
}
```

- [@Args](api/socketio/args.md) &lt;any|any[]&gt;: List of the parameters sent by the input event.
- [@Socket](api/socketio/socket.md) &lt;SocketIO.Socket&gt;: Socket instance.
- [@Nsp](api/socketio/nsp.md) &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.

### Send a response

You have a many choice to send a response to your client. Ts.ED offer some decorators to send a response:

![socketio](_media/socketio.png)

Example:

```typescript
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

!> Return value is only possible when the method is decorated by [@Emit](api/socketio/emit.md), [@Broadcast](api/socketio/broadcast.md) and [@BroadcastOthers](api/socketio/broadcastothers.md).

### Socket Session

Ts.ED create a new session for each socket. 

```typescript
@SocketService("/my-namespace") 
export class MySocketService {
    @Input("eventName")
    @Emit("responseEventName") // or Broadcast or BroadcastOthers
    async myMethod(@Args(0) userName: string, @SocketSession session: SocketSession) {
        
        const user = session.get("user") || {}
        user.name = userName;
        
        session.set("user", user);
        
        return user;
    }
}
```

### Decorators

- [@Args](api/socketio/args.md) &lt;any|any[]&gt;: List of the parameters sent by the input event.
- [@Broadcast](api/socketio/broadcast.md).
- [@BroadcastOther](api/socketio/broadcastother.md).
- [@Emit](api/socketio/emit.md).
- [@IO](api/socketio/io.md).
- [@Input](api/socketio/input.md).
- [@InputAndEmit](api/socketio/inputandemit.md).
- [@InputAndBroadcast](api/socketio/inputandbroadcast.md).
- [@InputAndBroadcastOther](api/socketio/inputandbroadcastother.md).
- [@Socket](api/socketio/socket.md) &lt;SocketIO.Socket&gt;: Socket instance.
- [@SocketSession](api/socketio/socketsession.md) &lt;SocketSession&gt;: Socket session.
- [@Nsp](api/socketio/nsp.md) &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.


<div class="guide-links">
<a href="#/tutorials/passport">Passport</a>
<a href="#/tutorials/swagger">Swagger</a>
</div>