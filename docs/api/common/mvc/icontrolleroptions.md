
<header class="symbol-info-header"><h1 id="icontrolleroptions">IControllerOptions</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IControllerOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/interfaces/IControllerOptions.ts#L0-L0">/common/mvc/interfaces/IControllerOptions.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IControllerOptions <span class="token punctuation">{</span>
    path?<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a><span class="token punctuation">;</span>
    dependencies?<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    routerOptions?<span class="token punctuation">:</span> <a href="#api/common/config/irouteroptions"><span class="token">IRouterOptions</span></a><span class="token punctuation">;</span>
    middlewares?<span class="token punctuation">:</span> <a href="#api/common/mvc/icontrollermiddlewares"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">path?<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">dependencies?<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">routerOptions?<span class="token punctuation">:</span> <a href="#api/common/config/irouteroptions"><span class="token">IRouterOptions</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">middlewares?<span class="token punctuation">:</span> <a href="#api/common/mvc/icontrollermiddlewares"><span class="token">IControllerMiddlewares</span></a></code></pre>
</div>








