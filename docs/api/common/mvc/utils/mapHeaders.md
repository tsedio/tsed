---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation mapHeaders function
---
# mapHeaders <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { mapHeaders }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/utils/mapHeaders.ts#L0-L0">/common/mvc/utils/mapHeaders.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">mapHeaders</span><span class="token punctuation">(</span>headers<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IHeadersOptions.html"><span class="token">IHeadersOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseHeaders.html"><span class="token">IResponseHeaders</span></a> <span class="token punctuation">{</span>
  return Object.<span class="token function">keys</span><span class="token punctuation">(</span>headers<span class="token punctuation">)</span>.reduce&lt<span class="token punctuation">;</span><a href="/api/common/mvc/interfaces/IResponseHeaders.html"><span class="token">IResponseHeaders</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">(</span>newHeaders<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseHeaders.html"><span class="token">IResponseHeaders</span></a><span class="token punctuation">,</span> key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> array<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>headers<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> type<span class="token punctuation"> = </span>typeof value<span class="token punctuation">;</span>
    <span class="token keyword">let</span> options<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseHeader.html"><span class="token">IResponseHeader</span></a><span class="token punctuation"> = </span><span class="token punctuation">{</span>value<span class="token punctuation">}</span><span class="token punctuation">;</span>

    if <span class="token punctuation">(</span>type === <span class="token string">"object"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      options<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
      type<span class="token punctuation"> = </span>typeof options.value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    options.type<span class="token punctuation"> = </span>options.type || type<span class="token punctuation">;</span>

    newHeaders<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>options<span class="token punctuation">;</span>

    return newHeaders<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>