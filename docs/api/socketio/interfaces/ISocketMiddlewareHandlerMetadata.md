---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ISocketMiddlewareHandlerMetadata interface
---
# ISocketMiddlewareHandlerMetadata <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ISocketMiddlewareHandlerMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/interfaces/ISocketMiddlewareHandlerMetadata.ts#L0-L0">/packages/socketio/src/interfaces/ISocketMiddlewareHandlerMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> ISocketMiddlewareHandlerMetadata <span class="token punctuation">{</span>
    parameters<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/socketio/interfaces/ISocketParamMetadata.html"><span class="token">ISocketParamMetadata</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    returns?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketReturnsTypes.html"><span class="token">SocketReturnsTypes</span></a><span class="token punctuation">;</span>
        eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">parameters<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/socketio/interfaces/ISocketParamMetadata.html"><span class="token">ISocketParamMetadata</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">returns?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketReturnsTypes.html"><span class="token">SocketReturnsTypes</span></a><span class="token punctuation">;</span>
     eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::