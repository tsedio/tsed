---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation GlobalErrorHandlerMiddleware class
---
# GlobalErrorHandlerMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { GlobalErrorHandlerMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/components/GlobalErrorHandlerMiddleware.ts#L0-L0">/common/mvc/components/GlobalErrorHandlerMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> GlobalErrorHandlerMiddleware <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IMiddlewareError.html"><span class="token">IMiddlewareError</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>settingsServerService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>headerName<span class="token punctuation"> = </span><span class="token string">"errors"</span><span class="token punctuation">}</span><span class="token punctuation"> = </span>settingsServerService.errors<span class="token punctuation">;</span>
    this.headerName<span class="token punctuation"> = </span>headerName<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Err.html"><span class="token">Err</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> toHTML<span class="token punctuation"> = </span><span class="token punctuation">(</span>message<span class="token punctuation"> = </span>""<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> message.<span class="token function">replace</span><span class="token punctuation">(</span>/\n/gi<span class="token punctuation">,</span> "&lt<span class="token punctuation">;</span>br /&gt<span class="token punctuation">;</span>"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>error instanceof Exception || error.status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      request.log.<span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        error<span class="token punctuation">:</span> <span class="token punctuation">{</span>
          message<span class="token punctuation">:</span> error.message<span class="token punctuation">,</span>
          stack<span class="token punctuation">:</span> error.stack<span class="token punctuation">,</span>
          status<span class="token punctuation">:</span> error.status<span class="token punctuation">,</span>
          origin<span class="token punctuation">:</span> error.origin
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      this.<span class="token function">setHeaders</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> error<span class="token punctuation">,</span> error.origin<span class="token punctuation">)</span><span class="token punctuation">;</span>
      response.<span class="token function">status</span><span class="token punctuation">(</span>error.status<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span><span class="token function">toHTML</span><span class="token punctuation">(</span>error.message<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>typeof error === "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      response.<span class="token function">status</span><span class="token punctuation">(</span>404<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span><span class="token function">toHTML</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    request.log.<span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      error<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        status<span class="token punctuation">:</span> 500<span class="token punctuation">,</span>
        message<span class="token punctuation">:</span> error.message<span class="token punctuation">,</span>
        stack<span class="token punctuation">:</span> error.stack<span class="token punctuation">,</span>
        origin<span class="token punctuation">:</span> error.origin
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.<span class="token function">setHeaders</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> error<span class="token punctuation">,</span> error.origin<span class="token punctuation">)</span><span class="token punctuation">;</span>
    response.<span class="token function">status</span><span class="token punctuation">(</span>error.status || 500<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span>"Internal Error"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">setHeaders</span><span class="token punctuation">(</span>response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseError.html"><span class="token">IResponseError</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> hErrors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    args.<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span>headers<span class="token punctuation">,</span> errors<span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseError.html"><span class="token">IResponseError</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>headers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        response.<span class="token function">set</span><span class="token punctuation">(</span>headers<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      if <span class="token punctuation">(</span>errors<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        hErrors<span class="token punctuation"> = </span>hErrors.<span class="token function">concat</span><span class="token punctuation">(</span>errors<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>hErrors.length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      response.<span class="token function">set</span><span class="token punctuation">(</span>this.headerName<span class="token punctuation">,</span> JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>hErrors<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Err.html"><span class="token">Err</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> toHTML<span class="token punctuation"> = </span><span class="token punctuation">(</span>message<span class="token punctuation"> = </span>""<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> message.<span class="token function">replace</span><span class="token punctuation">(</span>/\n/gi<span class="token punctuation">,</span> "&lt<span class="token punctuation">;</span>br /&gt<span class="token punctuation">;</span>"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>error instanceof Exception || error.status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   request.log.<span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
     error<span class="token punctuation">:</span> <span class="token punctuation">{</span>
       message<span class="token punctuation">:</span> error.message<span class="token punctuation">,</span>
       stack<span class="token punctuation">:</span> error.stack<span class="token punctuation">,</span>
       status<span class="token punctuation">:</span> error.status<span class="token punctuation">,</span>
       origin<span class="token punctuation">:</span> error.origin
     <span class="token punctuation">}</span>
   <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   this.<span class="token function">setHeaders</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> error<span class="token punctuation">,</span> error.origin<span class="token punctuation">)</span><span class="token punctuation">;</span>
   response.<span class="token function">status</span><span class="token punctuation">(</span>error.status<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span><span class="token function">toHTML</span><span class="token punctuation">(</span>error.message<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   return<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span>typeof error === "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   response.<span class="token function">status</span><span class="token punctuation">(</span>404<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span><span class="token function">toHTML</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   return<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 request.log.<span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
   error<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     status<span class="token punctuation">:</span> 500<span class="token punctuation">,</span>
     message<span class="token punctuation">:</span> error.message<span class="token punctuation">,</span>
     stack<span class="token punctuation">:</span> error.stack<span class="token punctuation">,</span>
     origin<span class="token punctuation">:</span> error.origin
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.<span class="token function">setHeaders</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> error<span class="token punctuation">,</span> error.origin<span class="token punctuation">)</span><span class="token punctuation">;</span>
 response.<span class="token function">status</span><span class="token punctuation">(</span>error.status || 500<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span>"Internal Error"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">setHeaders</span><span class="token punctuation">(</span>response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseError.html"><span class="token">IResponseError</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">let</span> hErrors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 args.<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span>headers<span class="token punctuation">,</span> errors<span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseError.html"><span class="token">IResponseError</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>headers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     response.<span class="token function">set</span><span class="token punctuation">(</span>headers<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   if <span class="token punctuation">(</span>errors<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     hErrors<span class="token punctuation"> = </span>hErrors.<span class="token function">concat</span><span class="token punctuation">(</span>errors<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">if <span class="token punctuation">(</span>hErrors.length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   response.<span class="token function">set</span><span class="token punctuation">(</span>this.headerName<span class="token punctuation">,</span> JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>hErrors<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span></code></pre>

</div>



:::