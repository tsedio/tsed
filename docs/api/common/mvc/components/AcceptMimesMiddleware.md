---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation AcceptMimesMiddleware class
---
# AcceptMimesMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AcceptMimesMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/mvc/components/AcceptMimesMiddleware"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/components/AcceptMimesMiddleware.ts#L0-L0">/common/mvc/components/AcceptMimesMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> AcceptMimesMiddleware <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IMiddleware.html"><span class="token">IMiddleware</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> mimes<span class="token punctuation"> = </span>endpoint.<span class="token function">get</span><span class="token punctuation">(</span>AcceptMimesMiddleware<span class="token punctuation">)</span> || <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> find<span class="token punctuation"> = </span>mimes.<span class="token function">find</span><span class="token punctuation">(</span><span class="token punctuation">(</span>mime<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> request.<span class="token function">accepts</span><span class="token punctuation">(</span>mime<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>!find<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      throw new <span class="token function">NotAcceptable</span><span class="token punctuation">(</span>mimes.<span class="token function">join</span><span class="token punctuation">(</span>"<span class="token punctuation">,</span> "<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> mimes<span class="token punctuation"> = </span>endpoint.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/common/mvc/components/AcceptMimesMiddleware.html"><span class="token">AcceptMimesMiddleware</span></a><span class="token punctuation">)</span> || <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> find<span class="token punctuation"> = </span>mimes.<span class="token function">find</span><span class="token punctuation">(</span><span class="token punctuation">(</span>mime<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> request.<span class="token function">accepts</span><span class="token punctuation">(</span>mime<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>!find<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   throw new <span class="token function">NotAcceptable</span><span class="token punctuation">(</span>mimes.<span class="token function">join</span><span class="token punctuation">(</span>"<span class="token punctuation">,</span> "<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::