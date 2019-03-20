---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation promiseTimeout function
---
# promiseTimeout <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { promiseTimeout }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/utils/promiseTimeout.ts#L0-L0">/packages/core/src/utils/promiseTimeout.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">promiseTimeout</span><span class="token punctuation">(</span>promise<span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> time?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token punctuation">{</span>
    ok<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
</code></pre>