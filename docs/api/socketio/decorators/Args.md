---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Args decorator
---
# Args <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Args }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//socketio/decorators/args.ts#L0-L0">/socketio/decorators/args.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Args</span><span class="token punctuation">(</span>mapIndex?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> useType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> type<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> param<span class="token punctuation"> = </span><span class="token punctuation">{</span>
      filter<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketFilters.html"><span class="token">SocketFilters</span></a>.ARGS<span class="token punctuation">,</span>
      useConverter<span class="token punctuation">:</span> false
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    if <span class="token punctuation">(</span>mapIndex !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      Object.<span class="token function">assign</span><span class="token punctuation">(</span>param<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        mapIndex<span class="token punctuation">,</span>
        useConverter<span class="token punctuation">:</span> true<span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> useType || type<span class="token punctuation">,</span>
        collectionType<span class="token punctuation">:</span> <span class="token function">isCollection</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span> ? type <span class="token punctuation">:</span> undefined
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    return store.<span class="token function">merge</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
          parameters<span class="token punctuation">:</span> <span class="token punctuation">{</span>
            <span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">:</span> param
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Inject the list of arguments in the decorated parameter.

`@Args` accept an index parameter to pick up directly the item in the arguments list.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Input("event")
  myMethod(@Args() arguments: any[]) {

  }

  @Input("event2")
  myMethod2(@Args(0) data: any) {

  }
}
```


:::