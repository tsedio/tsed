---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ParamRegistry class
---
# ParamRegistry <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ParamRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/filters/registries/ParamRegistry.ts#L0-L0">/packages/common/src/filters/registries/ParamRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ParamRegistry <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> getParams<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol | undefined<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> injectParams<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> isInjectable<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">usePreHandler</span><span class="token punctuation">(</span>service<span class="token punctuation">:</span> symbol<span class="token punctuation">,</span> settings<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/IParamArgs.html"><span class="token">IParamArgs</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof ParamRegistry<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> parameterIndex<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> allowedRequiredValues?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof ParamRegistry<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">decorate</span><span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial&lt<span class="token punctuation">;</span><a href="/api/common/filters/interfaces/IInjectableParamSettings.html"><span class="token">IInjectableParamSettings</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ParameterDecorator<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">useFilter</span><span class="token punctuation">(</span>service<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/IInjectableParamSettings.html"><span class="token">IInjectableParamSettings</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> hasNextFunction<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> getParams<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey?<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol | undefined<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> injectParams<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> isInjectable<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">usePreHandler</span><span class="token punctuation">(</span>service<span class="token punctuation">:</span> symbol<span class="token punctuation">,</span> settings<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/IParamArgs.html"><span class="token">IParamArgs</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> parameterIndex<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> allowedRequiredValues?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">decorate</span><span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial&lt<span class="token punctuation">;</span><a href="/api/common/filters/interfaces/IInjectableParamSettings.html"><span class="token">IInjectableParamSettings</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ParameterDecorator</code></pre>

</div>



Create a parameters decorators



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">useFilter</span><span class="token punctuation">(</span>service<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/IInjectableParamSettings.html"><span class="token">IInjectableParamSettings</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> hasNextFunction<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::