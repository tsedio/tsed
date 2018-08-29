---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ancestorsOf function
---
# ancestorsOf <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ancestorsOf }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//core/utils/ObjectUtils.ts#L0-L0">/core/utils/ObjectUtils.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">ancestorsOf</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> classes<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token keyword">let</span> currentTarget<span class="token punctuation"> = </span><span class="token function">getClass</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>

  while <span class="token punctuation">(</span><span class="token function">nameOf</span><span class="token punctuation">(</span>currentTarget<span class="token punctuation">)</span> !== ""<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    classes.<span class="token function">unshift</span><span class="token punctuation">(</span>currentTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
    currentTarget<span class="token punctuation"> = </span><span class="token function">getInheritedClass</span><span class="token punctuation">(</span>currentTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return classes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * <a href="/api/common/mvc/decorators/method/Get.html"><span class="token">Get</span></a> object name
 */</code></pre>