---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ServerSettingsService service
---
# ServerSettingsService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ServerSettingsService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/config/services/ServerSettingsService.ts#L0-L0">/packages/common/src/config/services/ServerSettingsService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ServerSettingsService <span class="token keyword">implements</span> <a href="/api/common/config/interfaces/IServerSettings.html"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> <a href="/api/di/interfaces/IDISettings.html"><span class="token">IDISettings</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    version<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    rootDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    httpsOptions<span class="token punctuation">:</span> Https.ServerOptions<span class="token punctuation">;</span>
    httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    env<span class="token punctuation">:</span> <a href="/api/core/interfaces/Env.html"><span class="token">Env</span></a><span class="token punctuation">;</span>
    mount<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IServerMountDirectories.html"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    statics<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IServerMountDirectories.html"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    /* istanbul ignore next */
    serveStatics<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IServerMountDirectories.html"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    routers<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a><span class="token punctuation">;</span>
    validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    logger<span class="token punctuation">:</span> Partial&lt<span class="token punctuation">;</span><a href="/api/common/config/interfaces/ILoggerSettings.html"><span class="token">ILoggerSettings</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    exclude<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    controllerScope<span class="token punctuation">:</span> <a href="/api/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a><span class="token punctuation">;</span>
    errors<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IErrorsSettings.html"><span class="token">IErrorsSettings</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getMetadata</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="/api/common/config/interfaces/IServerSettings.html"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    get&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token function">setHttpPort</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">getHttpsPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token function">setHttpsPort</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

`ServerSettingsService` contains all information about [ServerLoader](/api/common/server/components/ServerLoader.md) configuration.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">version<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">rootDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">httpsOptions<span class="token punctuation">:</span> Https.ServerOptions</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">env<span class="token punctuation">:</span> <a href="/api/core/interfaces/Env.html"><span class="token">Env</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">mount<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IServerMountDirectories.html"><span class="token">IServerMountDirectories</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">statics<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IServerMountDirectories.html"><span class="token">IServerMountDirectories</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">/* istanbul ignore next */</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">serveStatics<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IServerMountDirectories.html"><span class="token">IServerMountDirectories</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">routers<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">logger<span class="token punctuation">:</span> Partial&lt<span class="token punctuation">;</span><a href="/api/common/config/interfaces/ILoggerSettings.html"><span class="token">ILoggerSettings</span></a>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">exclude<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">controllerScope<span class="token punctuation">:</span> <a href="/api/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">errors<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IErrorsSettings.html"><span class="token">IErrorsSettings</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getMetadata</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="/api/common/config/interfaces/IServerSettings.html"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">setHttpPort</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getHttpsPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">setHttpsPort</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

</div>



:::