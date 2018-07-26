---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation extendsRequest function
---
# extendsRequest <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { extendsRequest }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/mvc/utils/extendsRequest"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/utils/extendsRequest.ts#L0-L0">/common/mvc/utils/extendsRequest.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">extendsRequest</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> Function | <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>typeof obj === <span class="token string">"object"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    Object.<span class="token function">keys</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token function">extendsRequest</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
    Object.<span class="token function">defineProperty</span><span class="token punctuation">(</span>express.request<span class="token punctuation">,</span> obj<span class="token punctuation">,</span> typeof value === <span class="token string">"function"</span> ? <span class="token punctuation">{</span>value<span class="token punctuation">}</span> <span class="token punctuation">:</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

if <span class="token punctuation">(</span>!express.request.setEndpoint<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">extendsRequest</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    /**
     *
     * @param endpoint
     */
    <span class="token function">setEndpoint</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._endpoint<span class="token punctuation"> = </span>endpoint<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    /**
     *
     * @returns <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span>
     */
    <span class="token function">getEndpoint</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return this._endpoint<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    /**
     *
     * @param data
     * @returns <span class="token punctuation">{</span>storeData<span class="token punctuation">}</span>
     */
    <span class="token function">storeData</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._responseData<span class="token punctuation"> = </span>data<span class="token punctuation">;</span>

      return this<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    /**
     *
     * @returns <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span>
     */
    <span class="token function">getStoredData</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return this._responseData<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>