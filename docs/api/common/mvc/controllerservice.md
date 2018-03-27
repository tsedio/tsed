
<header class="symbol-info-header"><h1 id="controllerservice">ControllerService</h1><label class="symbol-info-type-label service">Service</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ControllerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/services/ControllerService.ts#L0-L0">/common/mvc/services/ControllerService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ControllerService <span class="token keyword">extends</span> <a href="#api/core/proxyregistry"><span class="token">ProxyRegistry</span></a><<a href="#api/common/mvc/controllerprovider"><span class="token">ControllerProvider</span></a><span class="token punctuation">,</span> <a href="#api/common/mvc/icontrolleroptions"><span class="token">IControllerOptions</span></a>> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> <a href="#api/common/di/injectorservice"><span class="token">InjectorService</span></a><span class="token punctuation">,</span> expressApplication<span class="token punctuation">:</span> Express.Application<span class="token punctuation">,</span> serverSettings<span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/controllerprovider"><span class="token">ControllerProvider</span></a> | undefined<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> provider<span class="token punctuation">:</span> <a href="#api/common/mvc/controllerprovider"><span class="token">ControllerProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof ControllerService<span class="token punctuation">;</span>
    $<span class="token function">onRoutesInit</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        file<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        classes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">mapComponents</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <a href="#api/common/server/icomponentscanned"><span class="token">IComponentScanned</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    invoke<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<<a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token function">buildControllers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

ControllerService manage all controllers declared with `@ControllerProvider` decorators.

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/controllerprovider"><span class="token">ControllerProvider</span></a> | undefined</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> provider<span class="token punctuation">:</span> <a href="#api/common/mvc/controllerprovider"><span class="token">ControllerProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/mvc/controllerservice"><span class="token">ControllerService</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">onRoutesInit</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     file<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     classes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">mapComponents</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <a href="#api/common/server/icomponentscanned"><span class="token">IComponentScanned</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">invoke<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<<a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>


Invoke a controller from his Class.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">buildControllers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>
</div>


Build all controllers and mount routes to the ExpressApplication.







