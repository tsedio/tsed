---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IFilter interface
---
# IFilter <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IFilter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/filters/interfaces/IFilter.ts#L0-L0">/packages/common/src/filters/interfaces/IFilter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IFilter <span class="token punctuation">{</span>
    transform?<span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">transform?<span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::