
<header class="symbol-info-header"><h1 id="socketusebefore">SocketUseBefore</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label experimental" title="experimental">experimental</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketUseBefore }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//socketio/decorators/socketUseBefore.ts#L0-L0">/socketio/decorators/socketUseBefore.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketUseBefore</span><span class="token punctuation">(</span>...middlewares<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined<span class="token punctuation">,</span> descriptor?<span class="token punctuation">:</span> PropertyDescriptor | undefined<span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Attach a Socket Middleware to a method or a class.

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
        user = ConverterService.deserialize(user, User);

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

<!-- Members -->

