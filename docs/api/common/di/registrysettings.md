
<header class="symbol-info-header"><h1 id="registrysettings">RegistrySettings</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RegistrySettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.17.0/src//common/di/interfaces/RegistrySettings.ts#L0-L0">/common/di/interfaces/RegistrySettings.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> RegistrySettings <span class="token punctuation">{</span>
    registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>>><span class="token punctuation">;</span>
    injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    buildable<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    onInvoke?<span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> locals<span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">buildable<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">onInvoke?<span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> locals<span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>








