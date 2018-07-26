---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ResponseViewMiddleware class
---
# ResponseViewMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ResponseViewMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/components/ResponseViewMiddleware.ts#L0-L0">/common/mvc/components/ResponseViewMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ResponseViewMiddleware <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IMiddleware.html"><span class="token">IMiddleware</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/ResponseData.html"><span class="token">ResponseData</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return new <span class="token function">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span>viewPath<span class="token punctuation">,</span> viewOptions<span class="token punctuation">}</span><span class="token punctuation"> = </span>endpoint.store.<span class="token function">get</span><span class="token punctuation">(</span>ResponseViewMiddleware<span class="token punctuation">)</span><span class="token punctuation">;</span>
      if <span class="token punctuation">(</span>viewPath !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        if <span class="token punctuation">(</span>viewOptions !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          data<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> data<span class="token punctuation">,</span> viewOptions<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        response.<span class="token function">render</span><span class="token punctuation">(</span>viewPath<span class="token punctuation">,</span> data<span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> html<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
          /* istanbul ignore next */
          if <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>new <span class="token function"><a href="/api/common/mvc/errors/TemplateRenderingError.html"><span class="token">TemplateRenderingError</span></a></span><span class="token punctuation">(</span>endpoint.target<span class="token punctuation">,</span> endpoint.methodClassName<span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
            // request.<span class="token function">storeData</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token function">resolve</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/ResponseData.html"><span class="token">ResponseData</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return new <span class="token function">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> <span class="token punctuation">{</span>viewPath<span class="token punctuation">,</span> viewOptions<span class="token punctuation">}</span><span class="token punctuation"> = </span>endpoint.store.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/common/mvc/components/ResponseViewMiddleware.html"><span class="token">ResponseViewMiddleware</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
   if <span class="token punctuation">(</span>viewPath !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     if <span class="token punctuation">(</span>viewOptions !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       data<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> data<span class="token punctuation">,</span> viewOptions<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
     response.<span class="token function">render</span><span class="token punctuation">(</span>viewPath<span class="token punctuation">,</span> data<span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> html<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
       /* istanbul ignore next */
       if <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token function">reject</span><span class="token punctuation">(</span>new <span class="token function"><a href="/api/common/mvc/errors/TemplateRenderingError.html"><span class="token">TemplateRenderingError</span></a></span><span class="token punctuation">(</span>endpoint.target<span class="token punctuation">,</span> endpoint.methodClassName<span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
       <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
         // request.<span class="token function">storeData</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
         <span class="token function">resolve</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
       <span class="token punctuation">}</span>
     <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
     <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::