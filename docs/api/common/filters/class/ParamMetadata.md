---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ParamMetadata class
---
# ParamMetadata <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ParamMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/filters/class/ParamMetadata.ts#L0-L0">/packages/common/src/filters/class/ParamMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ParamMetadata <span class="token keyword">extends</span> <a href="/api/core/class/Storable.html"><span class="token">Storable</span></a> <span class="token keyword">implements</span> <a href="/api/common/filters/interfaces/IParamOptions.html"><span class="token">IParamOptions</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    service<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">;</span>
    useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    useValidation<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    paramType<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a><span class="token punctuation">;</span>
    <span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">isRequired</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
        required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
        use<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        baseType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _required<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



Required entity.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">service<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">useValidation<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">required<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



Change the state of the required data.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



Set the allowed values when the value is required.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">paramType<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



This method use `EntityDescription.required` and `allowedRequiredValues` to validate the value.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">isRequired</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
     required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
     use<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     baseType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::