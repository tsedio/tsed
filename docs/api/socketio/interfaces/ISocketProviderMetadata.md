---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ISocketProviderMetadata interface
---
# ISocketProviderMetadata <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ISocketProviderMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/socketio/src/interfaces/ISocketProviderMetadata.ts#L0-L0">/packages/socketio/src/interfaces/ISocketProviderMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> ISocketProviderMetadata <span class="token punctuation">{</span>
    type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketProviderTypes.html"><span class="token">SocketProviderTypes</span></a><span class="token punctuation">;</span>
    namespace?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    injectNamespaces?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        nsp<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    useBefore?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    useAfter?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/socketio/interfaces/ISocketHandlerMetadata.html"><span class="token">ISocketHandlerMetadata</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">type<span class="token punctuation">:</span> <a href="/api/socketio/interfaces/SocketProviderTypes.html"><span class="token">SocketProviderTypes</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">namespace?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">injectNamespaces?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     nsp<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">useBefore?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">useAfter?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/socketio/interfaces/ISocketHandlerMetadata.html"><span class="token">ISocketHandlerMetadata</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::