---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IFilterPreHandler interface
---
# IFilterPreHandler <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IFilterPreHandler }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/filters/interfaces/IFilterPreHandler.ts#L0-L0">/packages/common/src/filters/interfaces/IFilterPreHandler.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IFilterPreHandler <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/IFilterScope.html"><span class="token">IFilterScope</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    param?<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/IFilterScope.html"><span class="token">IFilterScope</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">param?<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a></code></pre>

</div>



:::