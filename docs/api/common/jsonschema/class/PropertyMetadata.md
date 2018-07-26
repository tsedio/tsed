---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation PropertyMetadata class
---
# PropertyMetadata <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PropertyMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/jsonschema/class/PropertyMetadata.ts#L0-L0">/common/jsonschema/class/PropertyMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> PropertyMetadata <span class="token keyword">extends</span> <a href="/api/core/class/Storable.html"><span class="token">Storable</span></a> <span class="token keyword">implements</span> <a href="/api/common/converters/interfaces/IPropertyOptions.html"><span class="token">IPropertyOptions</span></a> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.store.<span class="token function">set</span><span class="token punctuation">(</span>"schema"<span class="token punctuation">,</span> <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">property</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">,</span> this.type<span class="token punctuation">,</span> this.collectionType<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._type<span class="token punctuation"> = </span>value || Object<span class="token punctuation">;</span>
    this.store.<span class="token function">set</span><span class="token punctuation">(</span>"schema"<span class="token punctuation">,</span> <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">property</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">,</span> this.type<span class="token punctuation">,</span> this.collectionType<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">schema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a> <span class="token punctuation">{</span>
    return this.store.<span class="token function">get</span><span class="token punctuation">(</span>"schema"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">required</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">required</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.name || <span class="token punctuation">(</span>this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">required</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">required</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.name || <span class="token punctuation">(</span>this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">allowedRequiredValues</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return this._allowedRequiredValues<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">allowedRequiredValues</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._allowedRequiredValues<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">ignoreProperty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._ignoreProperty<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">ignoreProperty</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._ignoreProperty<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>this.required<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>value === undefined || value === null || value === ""<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        if <span class="token punctuation">(</span>this.allowedRequiredValues.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> === -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          return false<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    return true<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">isRequired</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this.required && <span class="token punctuation">[</span>undefined<span class="token punctuation">,</span> null<span class="token punctuation">,</span> ""<span class="token punctuation">]</span>.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1 && this.allowedRequiredValues.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> === -1<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Allowed value when the entity is required.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._type<span class="token punctuation"> = </span>value || Object<span class="token punctuation">;</span>
 this.store.<span class="token function">set</span><span class="token punctuation">(</span>"schema"<span class="token punctuation">,</span> <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">property</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">,</span> this.type<span class="token punctuation">,</span> this.collectionType<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">schema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a> <span class="token punctuation">{</span>
 return this.store.<span class="token function">get</span><span class="token punctuation">(</span>"schema"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">required</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">required</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.name || <span class="token punctuation">(</span>this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return the required state.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">required</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">required</span><span class="token punctuation">(</span>this.target<span class="token punctuation">,</span> this.name || <span class="token punctuation">(</span>this.propertyKey <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Change the state of the required data.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">allowedRequiredValues</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 return this._allowedRequiredValues<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return the allowed values.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">allowedRequiredValues</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._allowedRequiredValues<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Set the allowed values when the value is required.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">ignoreProperty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._ignoreProperty<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">ignoreProperty</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._ignoreProperty<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>this.required<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>value === undefined || value === null || value === ""<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     if <span class="token punctuation">(</span>this.allowedRequiredValues.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> === -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       return false<span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
 return true<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">isRequired</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this.required && <span class="token punctuation">[</span>undefined<span class="token punctuation">,</span> null<span class="token punctuation">,</span> ""<span class="token punctuation">]</span>.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1 && this.allowedRequiredValues.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> === -1<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::