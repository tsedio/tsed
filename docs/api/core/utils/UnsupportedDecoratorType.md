---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation UnsupportedDecoratorType class
---
# UnsupportedDecoratorType <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { UnsupportedDecoratorType }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//core/utils/DecoratorUtils.ts#L0-L0">/core/utils/DecoratorUtils.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> UnsupportedDecoratorType <span class="token keyword">extends</span> Error <span class="token punctuation">{</span>
  name<span class="token punctuation">:</span> <span class="token string">"UNSUPPORTED_DECORATOR_TYPE"</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>decorator<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>UnsupportedDecoratorType.<span class="token function">buildMessage</span><span class="token punctuation">(</span>decorator<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>decorator<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">[</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> index<span class="token punctuation">]</span><span class="token punctuation"> = </span>args<span class="token punctuation">;</span>
    <span class="token keyword">const</span> bindingType<span class="token punctuation"> = </span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span>args<span class="token punctuation">,</span> true<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> shortBinding<span class="token punctuation"> = </span>bindingType.<span class="token function">split</span><span class="token punctuation">(</span>"/"<span class="token punctuation">)</span><span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> param<span class="token punctuation"> = </span>shortBinding === <span class="token string">"parameter"</span> ? ".<span class="token punctuation">[</span>" + index + "<span class="token punctuation">]</span>" <span class="token punctuation">:</span> ""<span class="token punctuation">;</span>
    <span class="token keyword">const</span> cstr<span class="token punctuation"> = </span>shortBinding === <span class="token string">"parameter"</span> ? ".<span class="token keyword">constructor</span>" <span class="token punctuation">:</span> ""<span class="token punctuation">;</span>
    <span class="token keyword">const</span> method<span class="token punctuation"> = </span>propertyKey ? "." + propertyKey <span class="token punctuation">:</span> cstr<span class="token punctuation">;</span>
    <span class="token keyword">const</span> path<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span> + method + param<span class="token punctuation">;</span>
    return `$<span class="token punctuation">{</span>decorator.name<span class="token punctuation">}</span> cannot used <span class="token keyword">as</span> $<span class="token punctuation">{</span>bindingType<span class="token punctuation">}</span> at $<span class="token punctuation">{</span>path<span class="token punctuation">}</span>`<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name<span class="token punctuation">:</span> <span class="token string">"UNSUPPORTED_DECORATOR_TYPE"</span></code></pre>

</div>



:::