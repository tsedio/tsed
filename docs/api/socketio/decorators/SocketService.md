---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketService decorator
---
# SocketService <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/decorators/socketService.ts#L0-L0">/packages/socketio/src/decorators/socketService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">SocketService</span><span class="token punctuation">(</span>namespace?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

The decorators `@SocketService()` a new socket service (and service) can be injected in other service or controller on there `constructor`.
All services annotated with `@SocketService()` are constructed one time.

> `@SocketService()` use the `reflect-metadata` to collect and inject service on controllers or other services.


:::