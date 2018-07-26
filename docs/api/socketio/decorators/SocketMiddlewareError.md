---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketMiddlewareError decorator
---
# SocketMiddlewareError <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketMiddlewareError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//socketio/decorators/socketMiddlewareError.ts#L0-L0">/socketio/decorators/socketMiddlewareError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketMiddlewareError</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketProviderTypes.html"><span class="token">SocketProviderTypes</span></a>.MIDDLEWARE<span class="token punctuation">,</span>
      handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        use<span class="token punctuation">:</span> <span class="token punctuation">{</span>
          methodClassName<span class="token punctuation">:</span> <span class="token string">"use"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/class/MiddlewareError.html"><span class="token">MiddlewareError</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

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


:::