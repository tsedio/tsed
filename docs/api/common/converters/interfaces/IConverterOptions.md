---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IConverterOptions interface
---
# IConverterOptions <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IConverterOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/converters/interfaces/IConverter.ts#L0-L0">/packages/common/src/converters/interfaces/IConverter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IConverterOptions <span class="token punctuation">{</span>
    type?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    ignoreCallback?<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IConverterIgnoreCB.html"><span class="token">IConverterIgnoreCB</span></a><span class="token punctuation">;</span>
    checkRequiredValue?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">type?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">ignoreCallback?<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IConverterIgnoreCB.html"><span class="token">IConverterIgnoreCB</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">checkRequiredValue?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::