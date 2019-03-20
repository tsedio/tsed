---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketUseAfter decorator
---
# SocketUseAfter <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketUseAfter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/decorators/socketUseAfter.ts#L0-L0">/packages/socketio/src/decorators/socketUseAfter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketUseAfter</span><span class="token punctuation">(</span>...middlewares<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined<span class="token punctuation">,</span> descriptor?<span class="token punctuation">:</span> PropertyDescriptor | undefined<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Attach a Socket Middleware to a method or a class.

### Example

A middleware can be also used on a `SocketService` either on a class or on a method.

Here an example of a middleware:

```typescript
import {SocketMiddlewareError, SocketErr, Socket, Args} from "@tsed/socketio";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
   async use(@SocketErr() err: any, @Socket socket: SocketIO.Socket) {
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


:::