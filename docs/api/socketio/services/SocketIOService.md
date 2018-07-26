---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SocketIOService service
---
# SocketIOService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketIOService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//socketio/services/SocketIOService.ts#L0-L0">/socketio/services/SocketIOService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SocketIOService <span class="token keyword">implements</span> <a href="/api/common/server/interfaces/OnServerReady.html"><span class="token">OnServerReady</span></a> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"logger.disableRoutesSummary"<span class="token punctuation">,</span> false<span class="token punctuation">)</span>
  disableRoutesSummary<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> injector<span class="token punctuation">:</span> <a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a><span class="token punctuation">,</span>
    @<span class="token function"><a href="/api/common/di/decorators/Inject.html"><span class="token">Inject</span></a></span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">)</span> <span class="token keyword">private</span> httpServer<span class="token punctuation">:</span> <a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">,</span>
    @<span class="token function"><a href="/api/common/di/decorators/Inject.html"><span class="token">Inject</span></a></span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">)</span> <span class="token keyword">private</span> httpsServer<span class="token punctuation">:</span> <a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">,</span>
    @<a href="/api/socketio/decorators/IO.html"><span class="token">IO</span></a> <span class="token keyword">private</span> io<span class="token punctuation">:</span> SocketIO.Server<span class="token punctuation">,</span>
    <span class="token keyword">private</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span>
    <span class="token keyword">private</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"logger.disableRoutesSummary"<span class="token punctuation">,</span> false<span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">disableRoutesSummary<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> injector<span class="token punctuation">:</span> <a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/di/decorators/Inject.html"><span class="token">Inject</span></a></span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">)</span> <span class="token keyword">private</span> httpServer<span class="token punctuation">:</span> <a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/di/decorators/Inject.html"><span class="token">Inject</span></a></span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">)</span> <span class="token keyword">private</span> httpsServer<span class="token punctuation">:</span> <a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<a href="/api/socketio/decorators/IO.html"><span class="token">IO</span></a> <span class="token keyword">private</span> io<span class="token punctuation">:</span> SocketIO.Server<span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a></code></pre>

</div>



:::