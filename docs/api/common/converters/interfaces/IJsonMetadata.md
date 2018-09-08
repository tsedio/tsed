---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IJsonMetadata decorator
---
# IJsonMetadata <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IJsonMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/converters/interfaces/IJsonMetadata"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.4/packages/common/src/converters/interfaces/IJsonMetadata.ts#L0-L0">/packages/common/src/converters/interfaces/IJsonMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IJsonMetadata&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    name?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    use?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        new <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <a href="/api/core/utils/isCollection.html"><span class="token">isCollection</span></a>?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">use?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     new <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><a href="/api/core/utils/isCollection.html"><span class="token">isCollection</span></a>?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::