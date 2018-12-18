---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation interceptorInvokeFactory function
---
# interceptorInvokeFactory <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { interceptorInvokeFactory }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/interceptors/utils/interceptorInvokeFactory"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.33.0/packages/common/src/interceptors/utils/interceptorInvokeFactory.ts#L0-L0">/packages/common/src/interceptors/utils/interceptorInvokeFactory.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">interceptorInvokeFactory</span><span class="token punctuation">(</span>method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> interceptor<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span> & <a href="/api/common/interceptors/interfaces/IInterceptor.html"><span class="token">IInterceptor</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>injector<span class="token punctuation">:</span> <a href="/api/di/services/InjectorService.html"><span class="token">InjectorService</span></a><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>