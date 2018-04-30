
<header class="symbol-info-header"><h1 id="providers">Providers</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Providers }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/lib/di/class/Providers"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.15.1/src//common/di/class/Providers.ts#L0-L0">/common/di/class/Providers.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> Providers <span class="token keyword">extends</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>>> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">createRegistry</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> model<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>>><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial<<a href="#api/common/di/registrysettings"><span class="token">RegistrySettings</span></a>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/typedprovidersregistry"><span class="token">TypedProvidersRegistry</span></a><span class="token punctuation">;</span>
    <span class="token function">getRegistrySettings</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/registrysettings"><span class="token">RegistrySettings</span></a><span class="token punctuation">;</span>
    <span class="token function">createRegisterFn</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">getRegistry</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/typedprovidersregistry"><span class="token">TypedProvidersRegistry</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->





### Constructor



<pre><code class="typescript-lang "><span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>



Internal Map





### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">createRegistry</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> model<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>>><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial<<a href="#api/common/di/registrysettings"><span class="token">RegistrySettings</span></a>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/typedprovidersregistry"><span class="token">TypedProvidersRegistry</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getRegistrySettings</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/registrysettings"><span class="token">RegistrySettings</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">createRegisterFn</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getRegistry</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/typedprovidersregistry"><span class="token">TypedProvidersRegistry</span></a></code></pre>
</div>








