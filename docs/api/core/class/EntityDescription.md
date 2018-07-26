---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation EntityDescription class
---
# EntityDescription <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { EntityDescription }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core/class/EntityDescription"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//core/class/EntityDescription.ts#L0-L0">/core/class/EntityDescription.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> EntityDescription <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _collectionType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _type<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token keyword">protected</span> _target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> <span class="token keyword">protected</span> _propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> index?<span class="token punctuation">:</span> <span class="token keyword">number</span> | PropertyDescriptor<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>typeof index === "<span class="token keyword">number</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._index<span class="token punctuation"> = </span>index<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    this.target<span class="token punctuation"> = </span>_target<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">index</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">number</span> <span class="token punctuation">{</span>
    return this._index<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">target</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return <span class="token function">getClass</span><span class="token punctuation">(</span>this._target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">target</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.<span class="token function">setTarget</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">targetName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    return <span class="token function">nameOf</span><span class="token punctuation">(</span>this.target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">propertyKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol <span class="token punctuation">{</span>
    return this._propertyKey<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._type<span class="token punctuation"> = </span>value || Object<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">typeName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    return <span class="token function">nameOf</span><span class="token punctuation">(</span>this._type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">collectionType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return this._collectionType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">collectionType</span><span class="token punctuation">(</span>collectionType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._collectionType<span class="token punctuation"> = </span>collectionType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">collectionName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    return this._collectionType ? <span class="token function">nameOf</span><span class="token punctuation">(</span>this._collectionType<span class="token punctuation">)</span> <span class="token punctuation">:</span> ""<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isCollection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return !!this._collectionType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>this._collectionType<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isPrimitive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">isPrimitiveOrPrimitiveClass</span><span class="token punctuation">(</span>this._type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">isDate</span><span class="token punctuation">(</span>this._type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">isObject</span><span class="token punctuation">(</span>this.type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">isClass</span><span class="token punctuation">(</span>this.type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    return this._name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">name</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._name<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">setTarget</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    this._target<span class="token punctuation"> = </span>target<span class="token punctuation">;</span>
    <span class="token keyword">let</span> type<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>typeof this._index === "<span class="token keyword">number</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      type<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getParamTypes</span><span class="token punctuation">(</span>this._target<span class="token punctuation">,</span> this._propertyKey<span class="token punctuation">)</span><span class="token punctuation">[</span>this._index<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      type<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getType</span><span class="token punctuation">(</span>this._target<span class="token punctuation">,</span> this._propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span><span class="token function">isCollection</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._collectionType<span class="token punctuation"> = </span>type<span class="token punctuation">;</span>
      this._type<span class="token punctuation"> = </span>Object<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      this._type<span class="token punctuation"> = </span>type<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    this._name<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>this._propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

EntityDescription store all information collected by a decorator (class, property key and in option the index of the parameters).

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Type of the collection (Array, Map, Set, etc...)



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _collectionType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Custom name.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Type of the entity.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _type<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Index of the entity. Only used when the entity describe a parameters.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _index<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">index</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">number</span> <span class="token punctuation">{</span>
 return this._index<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return the index of the parameters.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">target</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 return <span class="token function">getClass</span><span class="token punctuation">(</span>this._target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Class of the entity.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">target</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this.<span class="token function">setTarget</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">targetName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
 return <span class="token function">nameOf</span><span class="token punctuation">(</span>this.target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return the class name of the entity.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">propertyKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol <span class="token punctuation">{</span>
 return this._propertyKey<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Name of the method or attribute related to the class.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._type<span class="token punctuation"> = </span>value || Object<span class="token punctuation">;</span>
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
<pre><code class="typescript-lang ">get <span class="token function">typeName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
 return <span class="token function">nameOf</span><span class="token punctuation">(</span>this._type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">collectionType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 return this._collectionType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">collectionType</span><span class="token punctuation">(</span>collectionType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._collectionType<span class="token punctuation"> = </span>collectionType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">collectionName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
 return this._collectionType ? <span class="token function">nameOf</span><span class="token punctuation">(</span>this._collectionType<span class="token punctuation">)</span> <span class="token punctuation">:</span> ""<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isCollection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return !!this._collectionType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>this._collectionType<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isPrimitive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token function">isPrimitiveOrPrimitiveClass</span><span class="token punctuation">(</span>this._type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token function">isDate</span><span class="token punctuation">(</span>this._type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token function">isObject</span><span class="token punctuation">(</span>this.type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token function">isClass</span><span class="token punctuation">(</span>this.type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
 return this._name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">name</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._name<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">setTarget</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
 this._target<span class="token punctuation"> = </span>target<span class="token punctuation">;</span>
 <span class="token keyword">let</span> type<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>typeof this._index === "<span class="token keyword">number</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   type<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getParamTypes</span><span class="token punctuation">(</span>this._target<span class="token punctuation">,</span> this._propertyKey<span class="token punctuation">)</span><span class="token punctuation">[</span>this._index<span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
   type<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getType</span><span class="token punctuation">(</span>this._target<span class="token punctuation">,</span> this._propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span><span class="token function">isCollection</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this._collectionType<span class="token punctuation"> = </span>type<span class="token punctuation">;</span>
   this._type<span class="token punctuation"> = </span>Object<span class="token punctuation">;</span>
 <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
   this._type<span class="token punctuation"> = </span>type<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 this._name<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>this._propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::