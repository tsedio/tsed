---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation invoke function
---
# invoke <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { invoke }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/testing"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//testing/invoke.ts#L0-L0">/testing/invoke.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">invoke</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> providers<span class="token punctuation">:</span> <span class="token punctuation">{</span>provide<span class="token punctuation">:</span> <span class="token keyword">any</span> | symbol<span class="token punctuation">;</span> use<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> injector<span class="token punctuation"> = </span><span class="token function">loadInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> locals<span class="token punctuation"> = </span>new <span class="token function">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  providers.<span class="token function">forEach</span><span class="token punctuation">(</span>p =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    locals.<span class="token function">set</span><span class="token punctuation">(</span>p.provide<span class="token punctuation">,</span> p.use<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  return injector.<span class="token function">invoke</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> locals<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>