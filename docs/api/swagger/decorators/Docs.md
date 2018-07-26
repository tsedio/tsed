---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Docs decorator
---
# Docs <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Docs }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//swagger/decorators/docs.ts#L0-L0">/swagger/decorators/docs.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Docs</span><span class="token punctuation">(</span>...docs<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    store.<span class="token function">merge</span><span class="token punctuation">(</span>"docs"<span class="token punctuation">,</span> docs<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>