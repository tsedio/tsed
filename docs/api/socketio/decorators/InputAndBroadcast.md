---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation InputAndBroadcast decorator
---
# InputAndBroadcast <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { InputAndBroadcast }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/decorators/inputAndBroadcast.ts#L0-L0">/packages/socketio/src/decorators/inputAndBroadcast.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">InputAndBroadcast</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> PropertyDescriptor<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Attach the decorated method to the socket event and broadcast the response to all clients.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @InputAndBroadcast("event")
  async myMethod(@Args(0) data: any, @Nsp socket) {
     return {data: "data"};
  }
}
```


:::