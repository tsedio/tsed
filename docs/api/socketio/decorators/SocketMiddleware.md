---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketMiddleware decorator
---
# SocketMiddleware <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//socketio/decorators/socketMiddleware.ts#L0-L0">/socketio/decorators/socketMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketMiddleware</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketProviderTypes.html"><span class="token">SocketProviderTypes</span></a>.MIDDLEWARE<span class="token punctuation">,</span>
      handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        use<span class="token punctuation">:</span> <span class="token punctuation">{</span>
          methodClassName<span class="token punctuation">:</span> <span class="token string">"use"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/class/Middleware.html"><span class="token">Middleware</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Declare a new SocketMiddleware.

### Example

A middleware can be also used on a `SocketService` either on a class or on a method.

Here an example of a middleware:

```typescript
@SocketMiddleware()
export class UserConverterSocketMiddleware {
    constructor(private converterService: ConverterService) {
    }
    async use(@Args() args: any[]) {

        let [user] = args;
        // update Arguments
        user = this.converterService.deserialize(user, User);

        return [user];
    }
}
```
> The user instance will be forwarded to the next middleware and to your decorated method.

Then:

```typescript
import {SocketService, SocketUseAfter, SocketUseBefore, Emit, Input, Args} from "@tsed/socketio";
import {UserConverterSocketMiddleware} from "../middlewares";
import {User} from "../models/User";

@SocketService("/my-namespace")
@SocketUseBefore(UserConverterSocketMiddleware) // global version
export class MySocketService {

   @Input("eventName")
   @Emit("responseEventName") // or Broadcast or BroadcastOthers
   @SocketUseBefore(UserConverterSocketMiddleware)
   async myMethod(@Args(0) user: User) {

       console.log(user);

       return user;
   }
}
```


:::