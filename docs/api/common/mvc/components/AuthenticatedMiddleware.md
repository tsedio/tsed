---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation AuthenticatedMiddleware class
---
# AuthenticatedMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AuthenticatedMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/components/AuthenticatedMiddleware.ts#L0-L0">/common/mvc/components/AuthenticatedMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> AuthenticatedMiddleware <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IMiddleware.html"><span class="token">IMiddleware</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Next.html"><span class="token">Next</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    // <span class="token keyword">const</span> options<span class="token punctuation"> = </span>endpoint.<span class="token function">get</span><span class="token punctuation">(</span>AuthenticatedMiddleware<span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> isAuthenticated<span class="token punctuation"> = </span><span class="token punctuation">(</span>request <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>.isAuthenticated<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>typeof isAuthenticated === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>!<span class="token function">isAuthenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">next</span><span class="token punctuation">(</span>new <span class="token function">Forbidden</span><span class="token punctuation">(</span>"Forbidden"<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        return<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

This middleware manage the authentication.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Next.html"><span class="token">Next</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 // <span class="token keyword">const</span> options<span class="token punctuation"> = </span>endpoint.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/common/mvc/components/AuthenticatedMiddleware.html"><span class="token">AuthenticatedMiddleware</span></a><span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> isAuthenticated<span class="token punctuation"> = </span><span class="token punctuation">(</span>request <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>.isAuthenticated<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>typeof isAuthenticated === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>!<span class="token function">isAuthenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     <span class="token function">next</span><span class="token punctuation">(</span>new <span class="token function">Forbidden</span><span class="token punctuation">(</span>"Forbidden"<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     return<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
 <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::