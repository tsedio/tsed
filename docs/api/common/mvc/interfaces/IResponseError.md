---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IResponseError interface
---
# IResponseError <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IResponseError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/interfaces/IResponseError.ts#L0-L0">/packages/common/src/mvc/interfaces/IResponseError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IResponseError <span class="token keyword">extends</span> Error <span class="token punctuation">{</span>
    errors?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    origin?<span class="token punctuation">:</span> Error<span class="token punctuation">;</span>
    headers?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseHeaders.html"><span class="token">IResponseHeaders</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Interface can be implemented to customize the error sent to the client.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">errors?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">origin?<span class="token punctuation">:</span> Error</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">headers?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseHeaders.html"><span class="token">IResponseHeaders</span></a></code></pre>

</div>



:::