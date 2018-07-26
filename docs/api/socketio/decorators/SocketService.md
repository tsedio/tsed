---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketService decorator
---
# SocketService <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//socketio/decorators/socketService.ts#L0-L0">/socketio/decorators/socketService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketService</span><span class="token punctuation">(</span>namespace<span class="token punctuation"> = </span>"/"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    store.<span class="token function">merge</span><span class="token punctuation">(</span>"socketIO"<span class="token punctuation">,</span> <span class="token punctuation">{</span>namespace<span class="token punctuation">,</span> type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketProviderTypes.html"><span class="token">SocketProviderTypes</span></a>.SERVICE<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token function">registerSocketService</span><span class="token punctuation">(</span>parameters<span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

The decorators `@SocketService()` a new socket service (and service) can be injected in other service or controller on there `constructor`.
All services annotated with `@SocketService()` are constructed one time.

> `@SocketService()` use the `reflect-metadata` to collect and inject service on controllers or other services.


:::