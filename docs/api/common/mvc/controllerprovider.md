
<header class="symbol-info-header"><h1 id="controllerprovider">ControllerProvider</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ControllerProvider }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/class/ControllerProvider.ts#L0-L0">/common/mvc/class/ControllerProvider.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ControllerProvider <span class="token keyword">extends</span> <a href="#api/common/di/providerstorable"><span class="token">ProviderStorable</span></a><<span class="token keyword">any</span>> <span class="token keyword">implements</span> <a href="#api/common/mvc/icontrolleroptions"><span class="token">IControllerOptions</span></a> <span class="token punctuation">{</span>
    router<span class="token punctuation">:</span> Express.Router<span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> routerPaths<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> endpoints<span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    dependencies<span class="token punctuation">:</span> <a href="#api/common/mvc/ichildrencontroller"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    routerOptions<span class="token punctuation">:</span> <a href="#api/common/config/irouteroptions"><span class="token">IRouterOptions</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> parent<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    middlewares<span class="token punctuation">:</span> <a href="#api/common/mvc/icontrollermiddlewares"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">;</span>
    <span class="token function">pushRouterPath</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    getEndpointUrl<span class="token punctuation">:</span> <span class="token punctuation">(</span>routerPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> => <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token function">hasEndpointUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">hasDependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">hasParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">router<span class="token punctuation">:</span> Express.Router</code></pre>
</div>


Controllers that depend to this controller.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">path<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>


set path



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> routerPaths<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> endpoints<span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">dependencies<span class="token punctuation">:</span> <a href="#api/common/mvc/ichildrencontroller"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">routerOptions<span class="token punctuation">:</span> <a href="#api/common/config/irouteroptions"><span class="token">IRouterOptions</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> parent<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">middlewares<span class="token punctuation">:</span> <a href="#api/common/mvc/icontrollermiddlewares"><span class="token">IControllerMiddlewares</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">pushRouterPath</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">getEndpointUrl<span class="token punctuation">:</span> <span class="token punctuation">(</span>routerPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> => <span class="token keyword">string</span></code></pre>
</div>


Resolve final endpoint url.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasEndpointUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasDependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>








