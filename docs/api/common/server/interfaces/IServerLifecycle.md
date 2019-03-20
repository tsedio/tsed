---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IServerLifecycle interface
---
# IServerLifecycle <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IServerLifecycle }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/server/interfaces/IServerLifeCycle.ts#L0-L0">/packages/common/src/server/interfaces/IServerLifeCycle.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IServerLifecycle <span class="token punctuation">{</span>
    version<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    $onInit?<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> | Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    $onMountingMiddlewares?<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    $afterRoutesInit?<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    $onReady?<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    $onServerInitError?<span class="token punctuation">(</span>error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

ServerLoader lifecycle let you intercept a phase.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">version<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$onInit?<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> | Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



This method is called when the server starting his lifecycle.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$onMountingMiddlewares?<span class="token punctuation">:</span> Function</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$afterRoutesInit?<span class="token punctuation">:</span> Function</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$onReady?<span class="token punctuation">:</span> Function</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$onServerInitError?<span class="token punctuation">(</span>error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::