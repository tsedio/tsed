---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketMiddleware decorator
---
# SocketMiddleware <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/decorators/socketMiddleware.ts#L0-L0">/packages/socketio/src/decorators/socketMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketMiddleware</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



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