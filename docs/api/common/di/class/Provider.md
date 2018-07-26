---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Provider class
---
# Provider <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Provider }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/di/class/Provider.ts#L0-L0">/common/di/class/Provider.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> Provider&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token keyword">implements</span> <a href="/api/common/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">protected</span> _useClass<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">protected</span> _instance<span class="token punctuation">:</span> T<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">protected</span> _type<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a> | <span class="token keyword">any</span><span class="token punctuation"> = </span><a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.PROVIDER<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token keyword">protected</span> _provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._provide<span class="token punctuation"> = </span><span class="token function">getClass</span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this._useClass<span class="token punctuation"> = </span><span class="token function">getClass</span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this._store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">provide</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    return this._provide<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">provide</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._provide<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">useClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return this._useClass || this._provide<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">useClass</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this._useClass<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T <span class="token punctuation">{</span>
    return this._instance<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">instance</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> T<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._instance<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._type<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">className</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">nameOf</span><span class="token punctuation">(</span>this.provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> get <span class="token function">store</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a> <span class="token punctuation">{</span>
    return this._store<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">scope</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a> <span class="token punctuation">{</span>
    return this.store.<span class="token function">get</span><span class="token punctuation">(</span>"scope"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">scope</span><span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.store.<span class="token function">set</span><span class="token punctuation">(</span>"scope"<span class="token punctuation">,</span> scope<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Provider&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> provider<span class="token punctuation"> = </span>new <span class="token function">Provider</span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
    provider._type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
    provider.useClass<span class="token punctuation"> = </span>this._useClass<span class="token punctuation">;</span>
    provider._instance<span class="token punctuation"> = </span>this._instance<span class="token punctuation">;</span>
    return provider<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">protected</span> _useClass<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">protected</span> _instance<span class="token punctuation">:</span> T</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">protected</span> _type<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a> | <span class="token keyword">any</span><span class="token punctuation"> = </span><a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.PROVIDER</code></pre>

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
<pre><code class="typescript-lang ">get <span class="token function">provide</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 return this._provide<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">provide</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._provide<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">useClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 return this._useClass || this._provide<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">useClass</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this._useClass<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T <span class="token punctuation">{</span>
 return this._instance<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">instance</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> T<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._instance<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._type<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">className</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return <span class="token function">nameOf</span><span class="token punctuation">(</span>this.provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> get <span class="token function">store</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a> <span class="token punctuation">{</span>
 return this._store<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">scope</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a> <span class="token punctuation">{</span>
 return this.store.<span class="token function">get</span><span class="token punctuation">(</span>"scope"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Get the scope of the provider.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">scope</span><span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this.store.<span class="token function">set</span><span class="token punctuation">(</span>"scope"<span class="token punctuation">,</span> scope<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Change the scope value of the provider.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> provider<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a></span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
 provider._type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
 provider.useClass<span class="token punctuation"> = </span>this._useClass<span class="token punctuation">;</span>
 provider._instance<span class="token punctuation"> = </span>this._instance<span class="token punctuation">;</span>
 return provider<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::