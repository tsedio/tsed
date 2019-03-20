---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketHandlersBuilder class
---
# SocketHandlersBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketHandlersBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio/src/class/SocketHandlersBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/class/SocketHandlersBuilder.ts#L0-L0">/packages/socketio/src/class/SocketHandlersBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SocketHandlersBuilder <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="/api/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a><span class="token punctuation">,</span> injector<span class="token punctuation">:</span> InjectorService<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span>nsps<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> SocketIO.Namespace&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token function">onConnection</span><span class="token punctuation">(</span>socket<span class="token punctuation">:</span> SocketIO.<a href="/api/socketio/decorators/Socket.html"><span class="token">Socket</span></a><span class="token punctuation">,</span> nsp<span class="token punctuation">:</span> SocketIO.Namespace<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">onDisconnect</span><span class="token punctuation">(</span>socket<span class="token punctuation">:</span> SocketIO.<a href="/api/socketio/decorators/Socket.html"><span class="token">Socket</span></a><span class="token punctuation">,</span> nsp<span class="token punctuation">:</span> SocketIO.Namespace<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span>nsps<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> SocketIO.Namespace&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">onConnection</span><span class="token punctuation">(</span>socket<span class="token punctuation">:</span> SocketIO.<a href="/api/socketio/decorators/Socket.html"><span class="token">Socket</span></a><span class="token punctuation">,</span> nsp<span class="token punctuation">:</span> SocketIO.Namespace<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">onDisconnect</span><span class="token punctuation">(</span>socket<span class="token punctuation">:</span> SocketIO.<a href="/api/socketio/decorators/Socket.html"><span class="token">Socket</span></a><span class="token punctuation">,</span> nsp<span class="token punctuation">:</span> SocketIO.Namespace<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::