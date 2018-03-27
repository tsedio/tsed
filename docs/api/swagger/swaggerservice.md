
<header class="symbol-info-header"><h1 id="swaggerservice">SwaggerService</h1><label class="symbol-info-type-label service">Service</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SwaggerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/services/SwaggerService.ts#L0-L0">/swagger/services/SwaggerService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SwaggerService <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>controllerService<span class="token punctuation">:</span> <a href="#api/common/mvc/controllerservice"><span class="token">ControllerService</span></a><span class="token punctuation">,</span> serverSettingsService<span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span> expressApplication<span class="token punctuation">:</span> Express.Application<span class="token punctuation">)</span><span class="token punctuation">;</span>
    $<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">getOpenAPISpec</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec<span class="token punctuation">;</span>
    <span class="token function">getDefaultSpec</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getOpenAPISpec</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getDefaultSpec</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec</code></pre>
</div>


Return the global api information.







