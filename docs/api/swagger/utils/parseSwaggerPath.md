---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation parseSwaggerPath function
---
# parseSwaggerPath <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { parseSwaggerPath }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/src/utils/index"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/utils/index.ts#L0-L0">/packages/swagger/src/utils/index.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">parseSwaggerPath</span><span class="token punctuation">(</span>base<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> path?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
    path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    pathParams<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
/**
 *
 * @param type
 * @returns <span class="token punctuation">{</span><span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span>
 */</code></pre>