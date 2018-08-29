---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Nsp decorator
---
# Nsp <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Nsp }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//socketio/decorators/nsp.ts#L0-L0">/socketio/decorators/nsp.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Nsp</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>typeof target === "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nsp<span class="token punctuation"> = </span>target <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">;</span>

    return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        injectNamespaces<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>propertyKey<span class="token punctuation">,</span> nsp<span class="token punctuation">}</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span>index === undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      injectNamespaces<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>propertyKey<span class="token punctuation">}</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return <span class="token function"><a href="/api/socketio/decorators/SocketFilter.html"><span class="token">SocketFilter</span></a></span><span class="token punctuation">(</span><a href="/api/socketio/interfaces/SocketFilters.html"><span class="token">SocketFilters</span></a>.NSP<span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey!<span class="token punctuation">,</span> index!<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Nsp
  nsp: SocketIO.Namespace; // will inject SocketIO.Namespace (not available on constructor)

  @Nsp("/my-other-namespace")
  nspOther: SocketIO.Namespace; // communication between two namespace

  @Input("event")
  myMethod(@Nsp namespace: SocketIO.Namespace) {

  }
}
```


:::