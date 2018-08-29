---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation getValue function
---
# getValue <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { getValue }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//core/utils/getValue.ts#L0-L0">/core/utils/getValue.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">getValue</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> defaultValue?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> separator<span class="token punctuation"> = </span>"."<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> keys<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span>expression.<span class="token function">split</span><span class="token punctuation">(</span>separator<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> getValue<span class="token punctuation"> = </span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span><span class="token function">isCollection</span><span class="token punctuation">(</span>scope<span class="token punctuation">)</span> && !<span class="token function">isArray</span><span class="token punctuation">(</span>scope<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return scope.<span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    return scope<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  while <span class="token punctuation">(</span><span class="token punctuation">(</span>scope<span class="token punctuation"> = </span><span class="token function">getValue</span><span class="token punctuation">(</span>keys.<span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span>!<span class="token punctuation">)</span><span class="token punctuation">)</span> && keys.length<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  return scope === undefined ? defaultValue <span class="token punctuation">:</span> scope<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>