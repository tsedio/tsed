
<header class="symbol-info-header"><h1 id="intercept">Intercept</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Intercept }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.14.4/src//common/interceptors/decorators/Intercept.ts#L0-L0">/common/interceptors/decorators/Intercept.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function Intercept<T <span class="token keyword">extends</span> <a href="#api/common/interceptors/iinterceptor"><span class="token">IInterceptor</span></a>><span class="token punctuation">(</span>interceptor<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Attaches interceptor to method call and executes the before and after methods

<!-- Members -->

