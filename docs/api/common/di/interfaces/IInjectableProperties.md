---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IInjectableProperties decorator
---
# IInjectableProperties <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInjectableProperties }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/di/interfaces/IInjectableProperties"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.9/packages/common/src/di/interfaces/IInjectableProperties.ts#L0-L0">/packages/common/src/di/interfaces/IInjectableProperties.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInjectableProperties <span class="token punctuation">{</span>
    <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IInjectablePropertyService.html"><span class="token">IInjectablePropertyService</span></a> | <a href="/api/common/di/interfaces/IInjectablePropertyValue.html"><span class="token">IInjectablePropertyValue</span></a> | <a href="/api/common/di/interfaces/IInjectablePropertyCustom.html"><span class="token">IInjectablePropertyCustom</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IInjectablePropertyService.html"><span class="token">IInjectablePropertyService</span></a> | <a href="/api/common/di/interfaces/IInjectablePropertyValue.html"><span class="token">IInjectablePropertyValue</span></a> | <a href="/api/common/di/interfaces/IInjectablePropertyCustom.html"><span class="token">IInjectablePropertyCustom</span></a></code></pre>

</div>



:::