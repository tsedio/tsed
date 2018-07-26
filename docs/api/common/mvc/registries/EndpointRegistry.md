---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation EndpointRegistry class
---
# EndpointRegistry <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { EndpointRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/registries/EndpointRegistry.ts#L0-L0">/common/mvc/registries/EndpointRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> EndpointRegistry <span class="token punctuation">{</span>
  <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token function">inherit</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> endpoints<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> inheritedClass<span class="token punctuation"> = </span><span class="token function">getInheritedClass</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    while <span class="token punctuation">(</span>inheritedClass && EndpointRegistry.<span class="token function">hasEndpoints</span><span class="token punctuation">(</span>inheritedClass<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.<span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>inheritedClass<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>endpointInheritedClass<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> endpoint<span class="token punctuation"> = </span>endpointInheritedClass.<span class="token function">inherit</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
        endpoints.<span class="token function">push</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      inheritedClass<span class="token punctuation"> = </span><span class="token function">getInheritedClass</span><span class="token punctuation">(</span>inheritedClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return endpoints<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>!this.<span class="token function">hasEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">getEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return this.<span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">inherit</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">hasEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">hasOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>!this.<span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> endpoint<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a></span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
      this.<span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">push</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> endpoint<span class="token punctuation">,</span> target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">hasOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">useBefore</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">)</span>.<span class="token function">before</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">use</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">useAfter</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">)</span>.<span class="token function">after</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">store</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a> <span class="token punctuation">{</span>
    return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">,</span> methodClassName<span class="token punctuation">,</span> <span class="token function">descriptorOf</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">,</span> methodClassName<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Registry for all Endpoint collected on a provide.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token function">inherit</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> endpoints<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token keyword">let</span> inheritedClass<span class="token punctuation"> = </span><span class="token function">getInheritedClass</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
 while <span class="token punctuation">(</span>inheritedClass && <a href="/api/common/mvc/registries/EndpointRegistry.html"><span class="token">EndpointRegistry</span></a>.<span class="token function">hasEndpoints</span><span class="token punctuation">(</span>inheritedClass<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this.<span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>inheritedClass<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>endpointInheritedClass<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
     <span class="token keyword">const</span> endpoint<span class="token punctuation"> = </span>endpointInheritedClass.<span class="token function">inherit</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
     endpoints.<span class="token function">push</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   inheritedClass<span class="token punctuation"> = </span><span class="token function">getInheritedClass</span><span class="token punctuation">(</span>inheritedClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return endpoints<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Retrieve all endpoints from inherited class and store it in the registry.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>!this.<span class="token function">hasEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return all endpoints from the given class. This method doesn't return the endpoints from the parent of the given class.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 return this.<span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">inherit</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Get all endpoints from a given class and his parents.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">hasEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">hasOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Gets a value indicating whether the target object or its prototype chain has endpoints.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>!this.<span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> endpoint<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a></span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
   this.<span class="token function">getOwnEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">push</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> endpoint<span class="token punctuation">,</span> target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Get an endpoint.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">hasOwn</span><span class="token punctuation">(</span>"endpoints"<span class="token punctuation">,</span> target<span class="token punctuation">,</span> method<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Gets a value indicating whether the target object or its prototype chain has already method registered.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">useBefore</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">)</span>.<span class="token function">before</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Append mvc in the pool (before).



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">use</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Add middleware and configuration for the endpoint.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">useAfter</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">)</span>.<span class="token function">after</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Append mvc in the pool (after).



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">store</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a> <span class="token punctuation">{</span>
 return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">,</span> methodClassName<span class="token punctuation">,</span> <span class="token function">descriptorOf</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">,</span> methodClassName<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Store a data on store manager.



:::