---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation InjectionScopeError class
---
# InjectionScopeError <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { InjectionScopeError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/di/errors/InjectionScopeError"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/di/errors/InjectionScopeError.ts#L0-L0">/common/di/errors/InjectionScopeError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> InjectionScopeError <span class="token keyword">extends</span> Error <span class="token punctuation">{</span>
  name<span class="token punctuation"> = </span><span class="token string">"INJECTION_SCOPE_ERROR"</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> parentClass<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>
      `<a href="/api/common/di/decorators/Service.html"><span class="token">Service</span></a> of type $<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">}</span> can not be injected <span class="token keyword">as</span> it is request scoped<span class="token punctuation">,</span> while $<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>parentClass<span class="token punctuation">)</span><span class="token punctuation">}</span> is singleton scoped`
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name<span class="token punctuation"> = </span><span class="token string">"INJECTION_SCOPE_ERROR"</span></code></pre>

</div>



:::