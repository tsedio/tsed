---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ParamMetadata class
---
# ParamMetadata <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ParamMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/filters/class/ParamMetadata.ts#L0-L0">/common/filters/class/ParamMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ParamMetadata <span class="token keyword">extends</span> <a href="/api/core/class/Storable.html"><span class="token">Storable</span></a> <span class="token keyword">implements</span> <a href="/api/common/filters/interfaces/IParamOptions.html"><span class="token">IParamOptions</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">protected</span> _required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation"> = </span>false<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  get <span class="token function">expression</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp <span class="token punctuation">{</span>
    return this._expression<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">expression</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._expression<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">service</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol <span class="token punctuation">{</span>
    return this._service <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">service</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._service<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
    this.name<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">useConverter</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._useConverter<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">useConverter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._useConverter<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">useValidation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._useValidation<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">useValidation</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._useValidation<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">required</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._required<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">required</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._required<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">allowedRequiredValues</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return this._allowedRequiredValues<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">allowedRequiredValues</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._allowedRequiredValues<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">paramType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a> <span class="token punctuation">{</span>
    return this._paramType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">paramType</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._paramType<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
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
  <span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token punctuation">{</span>
      service<span class="token punctuation">:</span> <span class="token function">nameOf</span><span class="token punctuation">(</span>this._service<span class="token punctuation">)</span><span class="token punctuation">,</span>
      name<span class="token punctuation">:</span> this.name<span class="token punctuation">,</span>
      expression<span class="token punctuation">:</span> this._expression<span class="token punctuation">,</span>
      required<span class="token punctuation">:</span> this._required<span class="token punctuation">,</span>
      use<span class="token punctuation">:</span> this.typeName<span class="token punctuation">,</span>
      baseType<span class="token punctuation">:</span> this.collectionName
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre>

</div>



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
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation"> = </span>true</code></pre>

</div>



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
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

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
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Allowed value when the entity is required.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Required entity.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation"> = </span>false</code></pre>

</div>



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
<pre><code class="typescript-lang ">get <span class="token function">expression</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp <span class="token punctuation">{</span>
 return this._expression<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">expression</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._expression<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">service</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol <span class="token punctuation">{</span>
 return this._service <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">service</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._service<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
 this.name<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">useConverter</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._useConverter<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">useConverter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._useConverter<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">useValidation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._useValidation<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">useValidation</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._useValidation<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">required</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._required<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return the required state.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">required</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._required<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
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
<pre><code class="typescript-lang ">get <span class="token function">paramType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a> <span class="token punctuation">{</span>
 return this._paramType<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">paramType</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._paramType<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
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



This method use `EntityDescription.required` and `allowedRequiredValues` to validate the value.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">isRequired</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this.required && <span class="token punctuation">[</span>undefined<span class="token punctuation">,</span> null<span class="token punctuation">,</span> ""<span class="token punctuation">]</span>.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1 && this.allowedRequiredValues.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> === -1<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token punctuation">{</span>
   service<span class="token punctuation">:</span> <span class="token function">nameOf</span><span class="token punctuation">(</span>this._service<span class="token punctuation">)</span><span class="token punctuation">,</span>
   name<span class="token punctuation">:</span> this.name<span class="token punctuation">,</span>
   expression<span class="token punctuation">:</span> this._expression<span class="token punctuation">,</span>
   required<span class="token punctuation">:</span> this._required<span class="token punctuation">,</span>
   use<span class="token punctuation">:</span> this.typeName<span class="token punctuation">,</span>
   baseType<span class="token punctuation">:</span> this.collectionName
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::