---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation LogIncomingRequestMiddleware class
---
# LogIncomingRequestMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { LogIncomingRequestMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/mvc/components/LogIncomingRequestMiddleware"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/components/LogIncomingRequestMiddleware.ts#L0-L0">/common/mvc/components/LogIncomingRequestMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> LogIncomingRequestMiddleware <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IMiddleware.html"><span class="token">IMiddleware</span></a> <span class="token punctuation">{</span>
  // tslint<span class="token punctuation">:</span>disable-next-line<span class="token punctuation">:</span> no-unused-variable
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.loggerSettings<span class="token punctuation"> = </span>serverSettingsService.logger <span class="token keyword">as</span> <a href="/api/common/config/interfaces/ILoggerSettings.html"><span class="token">ILoggerSettings</span></a><span class="token punctuation">;</span>
    this.reqIdBuilder<span class="token punctuation"> = </span>this.loggerSettings.reqIdBuilder || <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.AUTO_INCREMENT_ID++<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.fields<span class="token punctuation"> = </span>this.loggerSettings.requestFields || LogIncomingRequestMiddleware.DEFAULT_FIELDS<span class="token punctuation">;</span>
    this.debug<span class="token punctuation"> = </span>serverSettingsService.debug<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Req.html"><span class="token">Req</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Res.html"><span class="token">Res</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    this.<span class="token function">configureRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.<span class="token function">onLogStart</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">applyBefore</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> "end"<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.<span class="token function">onLogEnd</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> response<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">onLogStart</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    request.log.<span class="token function">debug</span><span class="token punctuation">(</span><span class="token punctuation">{</span>event<span class="token punctuation">:</span> <span class="token string">"start"</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">configureRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    request.id<span class="token punctuation"> = </span><span class="token function">String</span><span class="token punctuation">(</span>request.id ? request.id <span class="token punctuation">:</span> this.<span class="token function">reqIdBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    request.tsedReqStart<span class="token punctuation"> = </span>new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>ignoreUrlPatterns<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation"> = </span>this.loggerSettings<span class="token punctuation">;</span>
    <span class="token keyword">const</span> regs<span class="token punctuation"> = </span>ignoreUrlPatterns.<span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>pattern<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>typeof pattern === "<span class="token keyword">string</span>" ? new <span class="token function">RegExp</span><span class="token punctuation">(</span>pattern<span class="token punctuation">,</span> "gi"<span class="token punctuation">)</span> <span class="token punctuation">:</span> pattern<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> verbose<span class="token punctuation"> = </span><span class="token punctuation">(</span>req<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.<span class="token function">requestToObject</span><span class="token punctuation">(</span>req<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> info<span class="token punctuation"> = </span><span class="token punctuation">(</span>req<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.<span class="token function">minimalRequestPicker</span><span class="token punctuation">(</span>req<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> run<span class="token punctuation"> = </span><span class="token punctuation">(</span>cb<span class="token punctuation">:</span> Function<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> match<span class="token punctuation"> = </span>regs.<span class="token function">find</span><span class="token punctuation">(</span>reg =&gt<span class="token punctuation">;</span> !!request.url.<span class="token function">match</span><span class="token punctuation">(</span>reg<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      return !match && <span class="token function">cb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    request.log<span class="token punctuation"> = </span><span class="token punctuation">{</span>
      info<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">info</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> info<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      debug<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">debug</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      warn<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">warn</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      error<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">error</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      trace<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">trace</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">requestToObject</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    return <span class="token punctuation">{</span>
      reqId<span class="token punctuation">:</span> request.id<span class="token punctuation">,</span>
      method<span class="token punctuation">:</span> request.method<span class="token punctuation">,</span>
      url<span class="token punctuation">:</span> request.originalUrl || request.url<span class="token punctuation">,</span>
      duration<span class="token punctuation">:</span> this.<span class="token function">getDuration</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">,</span>
      headers<span class="token punctuation">:</span> request.headers<span class="token punctuation">,</span>
      body<span class="token punctuation">:</span> request.body<span class="token punctuation">,</span>
      query<span class="token punctuation">:</span> request.query<span class="token punctuation">,</span>
      params<span class="token punctuation">:</span> request.params
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">minimalRequestPicker</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> info<span class="token punctuation"> = </span>this.<span class="token function">requestToObject</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this.fields.<span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>acc<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      acc<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>info<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
      return acc<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">getDuration</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">number</span> <span class="token punctuation">{</span>
    return new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> - request.tsedReqStart.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> propertySelector<span class="token punctuation">:</span> <span class="token punctuation">(</span>e<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    return <span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>typeof scope === "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        scope<span class="token punctuation"> = </span><span class="token punctuation">{</span>message<span class="token punctuation">:</span> scope<span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      scope<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>scope<span class="token punctuation">,</span> <span class="token function">propertySelector</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      try <span class="token punctuation">{</span>
        return JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>scope<span class="token punctuation">,</span> null<span class="token punctuation">,</span> this.loggerSettings.jsonIndentation<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> catch <span class="token punctuation">(</span>er<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        $log.<span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span>error<span class="token punctuation">:</span> er<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      return ""<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">onLogEnd</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">setImmediate</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      /* istanbul ignore else */
      if <span class="token punctuation">(</span>request.id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        if <span class="token punctuation">(</span>this.loggerSettings.logRequest<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          request.log.<span class="token function">info</span><span class="token punctuation">(</span><span class="token punctuation">{</span>status<span class="token punctuation">:</span> response.statusCode<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        if <span class="token punctuation">(</span>this.debug<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          request.log.<span class="token function">debug</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            status<span class="token punctuation">:</span> response.statusCode<span class="token punctuation">,</span>
            data<span class="token punctuation">:</span> request.getStoredData && request.<span class="token function">getStoredData</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        this.<span class="token function">cleanRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">cleanRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    delete request.id<span class="token punctuation">;</span>
    delete request.tagId<span class="token punctuation">;</span>
    delete request.tsedReqStart<span class="token punctuation">;</span>
    request.log<span class="token punctuation"> = </span><span class="token punctuation">{</span>
      info<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      debug<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      warn<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      error<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      trace<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">// tslint<span class="token punctuation">:</span>disable-next-line<span class="token punctuation">:</span> no-unused-variable</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Req.html"><span class="token">Req</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Res.html"><span class="token">Res</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
 this.<span class="token function">configureRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.<span class="token function">onLogStart</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token function">applyBefore</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> "end"<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.<span class="token function">onLogEnd</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> response<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Handle the request.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">onLogStart</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 request.log.<span class="token function">debug</span><span class="token punctuation">(</span><span class="token punctuation">{</span>event<span class="token punctuation">:</span> <span class="token string">"start"</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



The separate onLogStart() function will allow developer to overwrite the initial request log.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">configureRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 request.id<span class="token punctuation"> = </span><span class="token function">String</span><span class="token punctuation">(</span>request.id ? request.id <span class="token punctuation">:</span> this.<span class="token function">reqIdBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 request.tsedReqStart<span class="token punctuation"> = </span>new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token punctuation">{</span>ignoreUrlPatterns<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation"> = </span>this.loggerSettings<span class="token punctuation">;</span>
 <span class="token keyword">const</span> regs<span class="token punctuation"> = </span>ignoreUrlPatterns.<span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>pattern<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>typeof pattern === "<span class="token keyword">string</span>" ? new <span class="token function">RegExp</span><span class="token punctuation">(</span>pattern<span class="token punctuation">,</span> "gi"<span class="token punctuation">)</span> <span class="token punctuation">:</span> pattern<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> verbose<span class="token punctuation"> = </span><span class="token punctuation">(</span>req<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.<span class="token function">requestToObject</span><span class="token punctuation">(</span>req<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> info<span class="token punctuation"> = </span><span class="token punctuation">(</span>req<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> this.<span class="token function">minimalRequestPicker</span><span class="token punctuation">(</span>req<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> run<span class="token punctuation"> = </span><span class="token punctuation">(</span>cb<span class="token punctuation">:</span> Function<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> match<span class="token punctuation"> = </span>regs.<span class="token function">find</span><span class="token punctuation">(</span>reg =&gt<span class="token punctuation">;</span> !!request.url.<span class="token function">match</span><span class="token punctuation">(</span>reg<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   return !match && <span class="token function">cb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
 request.log<span class="token punctuation"> = </span><span class="token punctuation">{</span>
   info<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">info</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> info<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
   debug<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">debug</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
   warn<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">warn</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
   error<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">error</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
   trace<span class="token punctuation">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> $log.<span class="token function">trace</span><span class="token punctuation">(</span>this.<span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> verbose<span class="token punctuation">)</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Attach all informations that will be necessary to log the request. Attach a new `request.log` object.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">requestToObject</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 return <span class="token punctuation">{</span>
   reqId<span class="token punctuation">:</span> request.id<span class="token punctuation">,</span>
   method<span class="token punctuation">:</span> request.method<span class="token punctuation">,</span>
   url<span class="token punctuation">:</span> request.originalUrl || request.url<span class="token punctuation">,</span>
   duration<span class="token punctuation">:</span> this.<span class="token function">getDuration</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">,</span>
   headers<span class="token punctuation">:</span> request.headers<span class="token punctuation">,</span>
   body<span class="token punctuation">:</span> request.body<span class="token punctuation">,</span>
   query<span class="token punctuation">:</span> request.query<span class="token punctuation">,</span>
   params<span class="token punctuation">:</span> request.params
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return complete request info.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">minimalRequestPicker</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> info<span class="token punctuation"> = </span>this.<span class="token function">requestToObject</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this.fields.<span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>acc<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   acc<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>info<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
   return acc<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">getDuration</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">number</span> <span class="token punctuation">{</span>
 return new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> - request.tsedReqStart.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">stringify</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> propertySelector<span class="token punctuation">:</span> <span class="token punctuation">(</span>e<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
 return <span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>typeof scope === "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     scope<span class="token punctuation"> = </span><span class="token punctuation">{</span>message<span class="token punctuation">:</span> scope<span class="token punctuation">}</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   scope<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>scope<span class="token punctuation">,</span> <span class="token function">propertySelector</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   try <span class="token punctuation">{</span>
     return JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>scope<span class="token punctuation">,</span> null<span class="token punctuation">,</span> this.loggerSettings.jsonIndentation<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span> catch <span class="token punctuation">(</span>er<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     $log.<span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">{</span>error<span class="token punctuation">:</span> er<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   return ""<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Return a filtered request from global configuration.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">onLogEnd</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Response.html"><span class="token">Response</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token function">setImmediate</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   /* istanbul ignore else */
   if <span class="token punctuation">(</span>request.id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     if <span class="token punctuation">(</span>this.loggerSettings.logRequest<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       request.log.<span class="token function">info</span><span class="token punctuation">(</span><span class="token punctuation">{</span>status<span class="token punctuation">:</span> response.statusCode<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
     if <span class="token punctuation">(</span>this.debug<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       request.log.<span class="token function">debug</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
         status<span class="token punctuation">:</span> response.statusCode<span class="token punctuation">,</span>
         data<span class="token punctuation">:</span> request.getStoredData && request.<span class="token function">getStoredData</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
       <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
     this.<span class="token function">cleanRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Called when the `request.end()` is called by Express.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">cleanRequest</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="/api/common/filters/decorators/Request.html"><span class="token">Request</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 delete request.id<span class="token punctuation">;</span>
 delete request.tagId<span class="token punctuation">;</span>
 delete request.tsedReqStart<span class="token punctuation">;</span>
 request.log<span class="token punctuation"> = </span><span class="token punctuation">{</span>
   info<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
   debug<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
   warn<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
   error<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
   trace<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Remove all data that added with `LogIncomingRequest.configureRequest()`.



:::