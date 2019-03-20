---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketSession decorator
---
# SocketSession <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketSession }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/decorators/socketSession.ts#L0-L0">/packages/socketio/src/decorators/socketSession.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type SocketSession<span class="token punctuation"> = </span>Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
function <span class="token function">SocketSession</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Inject the Socket instance in the decorated parameter.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Input("event")
  myMethod(@SocketSession session: Map) {
    console.log(session);
  }
}
```


:::