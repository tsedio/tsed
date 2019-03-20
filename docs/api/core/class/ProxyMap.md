---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ProxyMap class
---
# ProxyMap <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ProxyMap }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/class/ProxyMap.ts#L0-L0">/packages/core/src/class/ProxyMap.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> ProxyMap&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span> <span class="token keyword">implements</span> Map&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> registry<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> <span class="token punctuation">[</span>Symbol.toStringTag<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token string">"Map"</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>registry<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> mapSettings?<span class="token punctuation">:</span> <a href="/api/core/class/ProxyMapSettings.html"><span class="token">ProxyMapSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">[</span>Symbol.iterator<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span><span class="token punctuation">[</span>T<span class="token punctuation">,</span> I<span class="token punctuation">]</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">entries</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span><span class="token punctuation">[</span>T<span class="token punctuation">,</span> I<span class="token punctuation">]</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token function">keys</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span>I&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> I<span class="token punctuation">,</span> key<span class="token punctuation">:</span> T<span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> I | undefined<span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">,</span> value<span class="token punctuation">:</span> I<span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> size<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> registry<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> <span class="token punctuation">[</span>Symbol.toStringTag<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token string">"Map"</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">[</span>Symbol.iterator<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span><span class="token punctuation">[</span>T<span class="token punctuation">,</span> I<span class="token punctuation">]</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



The clear() method removes all elements from a Map object.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 key|<code>T</code>|Required. The key of the element to remove from the Map object. 





The delete() method removes the specified element from a Map object.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">entries</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span><span class="token punctuation">[</span>T<span class="token punctuation">,</span> I<span class="token punctuation">]</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">keys</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span></code></pre>

</div>



The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> IterableIterator&lt<span class="token punctuation">;</span>I&gt<span class="token punctuation">;</span></code></pre>

</div>



The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> I<span class="token punctuation">,</span> key<span class="token punctuation">:</span> T<span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 callbackfn|<code>(value: I</code>|Function to execute for each element.  thisArg|<code>any</code>|Optional. Value to use as this when executing callback. 





The forEach() method executes a provided function once per each key/value pair in the Map object, in insertion order.

The forEach method executes the provided callback once for each key of the map which actually exist. It is not invoked for keys which have been deleted. However, it is executed for values which are present but have the value undefined.
callback is invoked with three arguments:

* the element value
* the element key
* the Map object being traversed

If a thisArg parameter is provided to forEach, it will be passed to callback when invoked, for use as its this value.  Otherwise, the value undefined will be passed for use as its this value.  The this value ultimately observable by callback is determined according to the usual rules for determining the this seen by a function.

Each value is visited once, except in the case when it was deleted and re-added before forEach has finished. callback is not invoked for values deleted before being visited. New values added before forEach has finished will be visited.
forEach executes the callback function once for each element in the Map object; it does not return a value.




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> I | undefined</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 key|<code>T</code>|Required. The key of the element to return from the Map object. 





The get() method returns a specified element from a Map object.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">,</span> value<span class="token punctuation">:</span> I<span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 key|<code>T</code>|Required. The key of the element to add to the Map object.  value|<code>I</code>|Required. The value of the element to add to the Map object. 





The set() method adds or updates an element with a specified key and value to a Map object.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



The has() method returns a boolean indicating whether an element with the specified key exists or not.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> size<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



Return the size of the map.



:::