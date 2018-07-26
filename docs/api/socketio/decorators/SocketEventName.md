---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketEventName decorator
---
# SocketEventName <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketEventName }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//socketio/decorators/socketEventName.ts#L0-L0">/socketio/decorators/socketEventName.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketEventName</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  return <span class="token function"><a href="/api/socketio/decorators/SocketFilter.html"><span class="token">SocketFilter</span></a></span><span class="token punctuation">(</span><a href="/api/socketio/interfaces/SocketFilters.html"><span class="token">SocketFilters</span></a>.EVENT_NAME<span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Inject the Socket instance in the decorated parameter.

### Example

```typescript
@SocketMiddleware("/nsp")
export class MyMiddleware {
  use(@SocketEventName eventName: string) {

  }
}
```


:::