
<header class="symbol-info-header"><h1 id="registry">Registry</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Registry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.23.0/src//core/class/Registry.ts#L0-L0">/core/class/Registry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> Registry<T<span class="token punctuation">,</span> O> <span class="token keyword">extends</span> Map<<a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> T> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>_class<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/core/registryhook"><span class="token">RegistryHook</span></a><T><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T | undefined<span class="token punctuation">;</span>
    <span class="token function">createIfNotExists</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> metadata<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token function">merge</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> options<span class="token punctuation">:</span> Partial<O><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T | undefined</code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code><a href="#api/core/registrykey"><span class="token">RegistryKey</span></a></code>|Required. The key of the element to return from the Map object.





The get() method returns a specified element from a Map object.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">createIfNotExists</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


The has() method returns a boolean indicating whether an element with the specified key exists or not.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> metadata<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code><a href="#api/core/registrykey"><span class="token">RegistryKey</span></a></code>|Required. The key of the element to add to the Map object.
 metadata|<code>T</code>|Required. The value of the element to add to the Map object.





The set() method adds or updates an element with a specified key and value to a Map object.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">merge</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> options<span class="token punctuation">:</span> Partial<O><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Param | Type | Description
---|---|---
 key|<code><a href="#api/core/registrykey"><span class="token">RegistryKey</span></a></code>|Required. The key of the element to remove from the Map object.





The delete() method removes the specified element from a Map object.







