---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation interceptorInvokeFactory function
---
# interceptorInvokeFactory <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { interceptorInvokeFactory }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/interceptors/utils/interceptorInvokeFactory"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/interceptors/utils/interceptorInvokeFactory.ts#L0-L0">/common/interceptors/utils/interceptorInvokeFactory.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">interceptorInvokeFactory</span><span class="token punctuation">(</span>method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> interceptor<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span> & <a href="/api/common/interceptors/interfaces/IInterceptor.html"><span class="token">IInterceptor</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>injector<span class="token punctuation">:</span> <a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>injector.<span class="token function">has</span><span class="token punctuation">(</span>interceptor<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> originalMethod<span class="token punctuation"> = </span>target<span class="token punctuation">[</span>method<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> intcpt<span class="token punctuation"> = </span>injector.get&lt<span class="token punctuation">;</span><a href="/api/common/interceptors/interfaces/IInterceptor.html"><span class="token">IInterceptor</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>interceptor<span class="token punctuation">)</span>!<span class="token punctuation">;</span>

      function <span class="token function">interceptedMethod</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> context<span class="token punctuation"> = </span><span class="token punctuation">{</span>
          target<span class="token punctuation">,</span>
          method<span class="token punctuation">,</span>
          args<span class="token punctuation">,</span>
          <span class="token function">proceed</span><span class="token punctuation">(</span>err?<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            if <span class="token punctuation">(</span>!err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              return originalMethod.<span class="token function">apply</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            throw err<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>

        return intcpt.<span class="token function">aroundInvoke</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      target<span class="token punctuation">[</span>method<span class="token punctuation">]</span><span class="token punctuation"> = </span>interceptedMethod<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>