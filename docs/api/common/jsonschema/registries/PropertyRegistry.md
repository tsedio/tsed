---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation PropertyRegistry class
---
# PropertyRegistry <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PropertyRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/jsonschema/registries/PropertyRegistry.ts#L0-L0">/common/jsonschema/registries/PropertyRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> PropertyRegistry <span class="token punctuation">{</span>
  <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> properties<span class="token punctuation"> = </span>this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>!properties.<span class="token function">has</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.<span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> new <span class="token function"><a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a></span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">get</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">)</span>!<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">getProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> map<span class="token punctuation"> = </span>new Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">ancestorsOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>klass =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>klass<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>v<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        if <span class="token punctuation">(</span>!v.ignoreProperty<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          map.<span class="token function">set</span><span class="token punctuation">(</span>k<span class="token punctuation">,</span> v<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    return map<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">hasOwn</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/PROPERTIES_METADATA.html"><span class="token">PROPERTIES_METADATA</span></a><span class="token punctuation">,</span> target<span class="token punctuation">)</span>
      ? <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getOwn</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/PROPERTIES_METADATA.html"><span class="token">PROPERTIES_METADATA</span></a><span class="token punctuation">,</span> target<span class="token punctuation">)</span>
      <span class="token punctuation">:</span> new Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> property<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> properties<span class="token punctuation"> = </span>this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    properties.<span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">,</span> property<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/PROPERTIES_METADATA.html"><span class="token">PROPERTIES_METADATA</span></a><span class="token punctuation">,</span> properties<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> property<span class="token punctuation"> = </span>this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    property.required<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
    property.allowedRequiredValues<span class="token punctuation"> = </span>allowedRequiredValues.<span class="token function">concat</span><span class="token punctuation">(</span>property.allowedRequiredValues<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.<span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> property<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span>.store.<span class="token function">merge</span><span class="token punctuation">(</span>"responses"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      "400"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        description<span class="token punctuation">:</span> <span class="token string">"BadRequest"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">decorate</span><span class="token punctuation">(</span>fn<span class="token punctuation">:</span> <span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
    return <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> propertyMetadata<span class="token punctuation"> = </span>PropertyRegistry.<span class="token function">get</span><span class="token punctuation">(</span>parameters<span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">,</span> parameters<span class="token punctuation">[</span>1<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> result<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token function">fn</span><span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">,</span> parameters <span class="token keyword">as</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
      if <span class="token punctuation">(</span>typeof result === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">result</span><span class="token punctuation">(</span>...parameters<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> properties<span class="token punctuation"> = </span>this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>!properties.<span class="token function">has</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this.<span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> new <span class="token function"><a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a></span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">get</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">)</span>!<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> map<span class="token punctuation"> = </span>new Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token function">ancestorsOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>klass =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>klass<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>v<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> k<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
     if <span class="token punctuation">(</span>!v.ignoreProperty<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       map.<span class="token function">set</span><span class="token punctuation">(</span>k<span class="token punctuation">,</span> v<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
   <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 return map<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">hasOwn</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/PROPERTIES_METADATA.html"><span class="token">PROPERTIES_METADATA</span></a><span class="token punctuation">,</span> target<span class="token punctuation">)</span>
   ? <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getOwn</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/PROPERTIES_METADATA.html"><span class="token">PROPERTIES_METADATA</span></a><span class="token punctuation">,</span> target<span class="token punctuation">)</span>
   <span class="token punctuation">:</span> new Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> property<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> properties<span class="token punctuation"> = </span>this.<span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
 properties.<span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">,</span> property<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/PROPERTIES_METADATA.html"><span class="token">PROPERTIES_METADATA</span></a><span class="token punctuation">,</span> properties<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> property<span class="token punctuation"> = </span>this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
 property.required<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
 property.allowedRequiredValues<span class="token punctuation"> = </span>allowedRequiredValues.<span class="token function">concat</span><span class="token punctuation">(</span>property.allowedRequiredValues<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.<span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> property<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span>.store.<span class="token function">merge</span><span class="token punctuation">(</span>"responses"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
   "400"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     description<span class="token punctuation">:</span> <span class="token string">"BadRequest"</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">decorate</span><span class="token punctuation">(</span>fn<span class="token punctuation">:</span> <span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
 return <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> propertyMetadata<span class="token punctuation"> = </span><a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">get</span><span class="token punctuation">(</span>parameters<span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">,</span> parameters<span class="token punctuation">[</span>1<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token keyword">const</span> result<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token function">fn</span><span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">,</span> parameters <span class="token keyword">as</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
   if <span class="token punctuation">(</span>typeof result === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     <span class="token function">result</span><span class="token punctuation">(</span>...parameters<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::