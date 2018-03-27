
<header class="symbol-info-header"><h1 id="socketmiddlewareerror">SocketMiddlewareError</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label experimental" title="experimental">experimental</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketMiddlewareError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//socketio/decorators/socketMiddlewareError.ts#L0-L0">/socketio/decorators/socketMiddlewareError.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketMiddlewareError</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Declare a new SocketMiddlewareError.

### Example

A middleware can be also used on a `SocketService` either on a class or on a method.

Here an example of a middleware:

```typescript
import {SocketMiddlewareError, SocketErr, Socket, Args} from "@tsed/socketio";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
   async use(@SocketEventName, @SocketErr err: any, @Socket socket: SocketIO.Socket) {
       console.error(err);
       socket.emit("error", {message: "An error has occured"})
   }
}
```

Then:

```typescript
import {SocketService, SocketUseAfter, SocketUseBefore, Emit, Input, Args} from "@tsed/socketio";
import {ErrorHandlerSocketMiddleware} from "../middlewares";
import {User} from "../models/User";

@SocketService("/my-namespace")
@SocketUseAfter(ErrorHandlerSocketMiddleware) // global version
export class MySocketService {

   @Input("eventName")
   @Emit("responseEventName") // or Broadcast or BroadcastOthers
   @SocketUseAfter(ErrorHandlerSocketMiddleware)
   async myMethod(@Args(0) userName: User) {

       console.log(user);
       throw new Error("Error");

       return user;
   }
}
```

<!-- Members -->

