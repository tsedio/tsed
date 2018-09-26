---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IInjectablePropertyService decorator
---
# IInjectablePropertyService <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInjectablePropertyService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/di/interfaces/IInjectableProperties"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.9/packages/common/src/di/interfaces/IInjectableProperties.ts#L0-L0">/packages/common/src/di/interfaces/IInjectableProperties.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInjectablePropertyService <span class="token keyword">extends</span> <a href="/api/common/di/interfaces/IInjectableProperty.html"><span class="token">IInjectableProperty</span></a> <span class="token punctuation">{</span>
    bindingType<span class="token punctuation">:</span> <span class="token string">"method"</span> | "property"<span class="token punctuation">;</span>
    propertyType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    useType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">bindingType<span class="token punctuation">:</span> <span class="token string">"method"</span> | "property"</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">propertyType<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">useType<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::