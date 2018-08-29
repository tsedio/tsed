---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SwaggerService service
---
# SwaggerService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SwaggerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//swagger/services/SwaggerService.ts#L0-L0">/swagger/services/SwaggerService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SwaggerService <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> controllerService<span class="token punctuation">:</span> <a href="/api/common/mvc/services/ControllerService.html"><span class="token">ControllerService</span></a><span class="token punctuation">,</span>
    <span class="token keyword">private</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span>
    @<a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a> <span class="token keyword">private</span> expressApplication<span class="token punctuation">:</span> Express.Application
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>this <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>.rand<span class="token punctuation"> = </span>Math.<span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  $<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> swagger<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>this.serverSettingsService.<span class="token function">get</span><span class="token punctuation">(</span>"swagger"<span class="token punctuation">)</span><span class="token punctuation">)</span>.<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> urls<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span>swagger.<span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>acc<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> conf<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span>path<span class="token punctuation"> = </span>"/"<span class="token punctuation">,</span> doc<span class="token punctuation">,</span> hidden<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
      if <span class="token punctuation">(</span>!hidden<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        acc.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>url<span class="token punctuation">:</span> `$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/swagger.json`<span class="token punctuation">,</span> name<span class="token punctuation">:</span> doc || path<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      return acc<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    swagger.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span>path<span class="token punctuation"> = </span>"/"<span class="token punctuation">,</span> options<span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> outFile<span class="token punctuation">,</span> showExplorer<span class="token punctuation">,</span> cssPath<span class="token punctuation">,</span> jsPath<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
      <span class="token keyword">const</span> spec<span class="token punctuation"> = </span>this.<span class="token function">getOpenAPISpec</span><span class="token punctuation">(</span>conf<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> scope<span class="token punctuation"> = </span><span class="token punctuation">{</span>
        spec<span class="token punctuation">,</span>
        url<span class="token punctuation">:</span> `$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/swagger.json`<span class="token punctuation">,</span>
        urls<span class="token punctuation">,</span>
        showExplorer<span class="token punctuation">,</span>
        cssPath<span class="token punctuation">,</span>
        jsPath<span class="token punctuation">,</span>
        swaggerOptions<span class="token punctuation">:</span> options
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
      this.expressApplication.<span class="token function">get</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> this.<span class="token function">middlewareRedirect</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      this.expressApplication.<span class="token function">use</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> this.<span class="token function">createRouter</span><span class="token punctuation">(</span>conf<span class="token punctuation">,</span> scope<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      if <span class="token punctuation">(</span>outFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        Fs.<span class="token function">writeFileSync</span><span class="token punctuation">(</span>outFile<span class="token punctuation">,</span> JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>spec<span class="token punctuation">,</span> null<span class="token punctuation">,</span> 2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  $<span class="token function">onServerReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> host<span class="token punctuation"> = </span>this.serverSettingsService.<span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> swagger<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>this.serverSettingsService.<span class="token function">get</span><span class="token punctuation">(</span>"swagger"<span class="token punctuation">)</span><span class="token punctuation">)</span>.<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span><span class="token punctuation">;</span>
    swagger.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span>path<span class="token punctuation"> = </span>"/"<span class="token punctuation">,</span> doc<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
      $log.<span class="token function">info</span><span class="token punctuation">(</span>`<span class="token punctuation">[</span>$<span class="token punctuation">{</span>doc || "default"<span class="token punctuation">}</span><span class="token punctuation">]</span> Swagger JSON is available on http<span class="token punctuation">:</span>//$<span class="token punctuation">{</span>host.address<span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>host.port<span class="token punctuation">}</span>$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/swagger.json`<span class="token punctuation">)</span><span class="token punctuation">;</span>
      $log.<span class="token function">info</span><span class="token punctuation">(</span>`<span class="token punctuation">[</span>$<span class="token punctuation">{</span>doc || "default"<span class="token punctuation">}</span><span class="token punctuation">]</span> Swagger UI is available on http<span class="token punctuation">:</span>//$<span class="token punctuation">{</span>host.address<span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>host.port<span class="token punctuation">}</span>$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/`<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">createRouter</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">,</span> scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>cssPath<span class="token punctuation">,</span> jsPath<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
    <span class="token keyword">const</span> router<span class="token punctuation"> = </span>Express.<span class="token function">Router</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    router.<span class="token function">get</span><span class="token punctuation">(</span>"/"<span class="token punctuation">,</span> this.<span class="token function">middlewareIndex</span><span class="token punctuation">(</span>scope<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    router.<span class="token function">get</span><span class="token punctuation">(</span>"/swagger.json"<span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> res.<span class="token function">status</span><span class="token punctuation">(</span>200<span class="token punctuation">)</span>.<span class="token function">json</span><span class="token punctuation">(</span>scope.spec<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    router.<span class="token function">use</span><span class="token punctuation">(</span>Express.<span class="token keyword">static</span><span class="token punctuation">(</span>swaggerUiPath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>cssPath<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      router.<span class="token function">get</span><span class="token punctuation">(</span>"/main.css"<span class="token punctuation">,</span> this.<span class="token function">middlewareCss</span><span class="token punctuation">(</span>cssPath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>jsPath<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      router.<span class="token function">get</span><span class="token punctuation">(</span>"/main.js"<span class="token punctuation">,</span> this.<span class="token function">middlewareJs</span><span class="token punctuation">(</span>jsPath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return router<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">middlewareRedirect</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    /* istanbul ignore next */
    return <span class="token punctuation">(</span>req<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>req.url === path && !req.url.<span class="token function">match</span><span class="token punctuation">(</span>/\/$/<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        res.<span class="token function">redirect</span><span class="token punctuation">(</span>path + "/"<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">middlewareIndex</span><span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    /* istanbul ignore next */
    return <span class="token punctuation">(</span>req<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span>
      ejs.<span class="token function">renderFile</span><span class="token punctuation">(</span>__dirname + "/../views/index.ejs"<span class="token punctuation">,</span> scope<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> str<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        if <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          $log.<span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
          res.<span class="token function">status</span><span class="token punctuation">(</span>500<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span>err.message<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
          res.<span class="token function">send</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> controllerService<span class="token punctuation">:</span> <a href="/api/common/mvc/services/ControllerService.html"><span class="token">ControllerService</span></a><span class="token punctuation">,</span></code></pre>

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
<pre><code class="typescript-lang ">@<a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a> <span class="token keyword">private</span> expressApplication<span class="token punctuation">:</span> Express.Application</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token punctuation">(</span>this <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>.rand<span class="token punctuation"> = </span>Math.<span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> swagger<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>this.serverSettingsService.<span class="token function">get</span><span class="token punctuation">(</span>"swagger"<span class="token punctuation">)</span><span class="token punctuation">)</span>.<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> urls<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span>swagger.<span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>acc<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> conf<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> <span class="token punctuation">{</span>path<span class="token punctuation"> = </span>"/"<span class="token punctuation">,</span> doc<span class="token punctuation">,</span> hidden<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
   if <span class="token punctuation">(</span>!hidden<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     acc.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>url<span class="token punctuation">:</span> `$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/swagger.json`<span class="token punctuation">,</span> name<span class="token punctuation">:</span> doc || path<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   return acc<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 swagger.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> <span class="token punctuation">{</span>path<span class="token punctuation"> = </span>"/"<span class="token punctuation">,</span> options<span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> outFile<span class="token punctuation">,</span> showExplorer<span class="token punctuation">,</span> cssPath<span class="token punctuation">,</span> jsPath<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
   <span class="token keyword">const</span> spec<span class="token punctuation"> = </span>this.<span class="token function">getOpenAPISpec</span><span class="token punctuation">(</span>conf<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token keyword">const</span> scope<span class="token punctuation"> = </span><span class="token punctuation">{</span>
     spec<span class="token punctuation">,</span>
     url<span class="token punctuation">:</span> `$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/swagger.json`<span class="token punctuation">,</span>
     urls<span class="token punctuation">,</span>
     showExplorer<span class="token punctuation">,</span>
     cssPath<span class="token punctuation">,</span>
     jsPath<span class="token punctuation">,</span>
     swaggerOptions<span class="token punctuation">:</span> options
   <span class="token punctuation">}</span><span class="token punctuation">;</span>
   this.expressApplication.<span class="token function">get</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> this.<span class="token function">middlewareRedirect</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   this.expressApplication.<span class="token function">use</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> this.<span class="token function">createRouter</span><span class="token punctuation">(</span>conf<span class="token punctuation">,</span> scope<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   if <span class="token punctuation">(</span>outFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     Fs.<span class="token function">writeFileSync</span><span class="token punctuation">(</span>outFile<span class="token punctuation">,</span> JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>spec<span class="token punctuation">,</span> null<span class="token punctuation">,</span> 2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">onServerReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> host<span class="token punctuation"> = </span>this.serverSettingsService.<span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> swagger<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>this.serverSettingsService.<span class="token function">get</span><span class="token punctuation">(</span>"swagger"<span class="token punctuation">)</span><span class="token punctuation">)</span>.<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span><span class="token punctuation">;</span>
 swagger.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> <span class="token punctuation">{</span>path<span class="token punctuation"> = </span>"/"<span class="token punctuation">,</span> doc<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
   $log.<span class="token function">info</span><span class="token punctuation">(</span>`<span class="token punctuation">[</span>$<span class="token punctuation">{</span>doc || "default"<span class="token punctuation">}</span><span class="token punctuation">]</span> Swagger JSON is available on http<span class="token punctuation">:</span>//$<span class="token punctuation">{</span>host.address<span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>host.port<span class="token punctuation">}</span>$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/swagger.json`<span class="token punctuation">)</span><span class="token punctuation">;</span>
   $log.<span class="token function">info</span><span class="token punctuation">(</span>`<span class="token punctuation">[</span>$<span class="token punctuation">{</span>doc || "default"<span class="token punctuation">}</span><span class="token punctuation">]</span> Swagger UI is available on http<span class="token punctuation">:</span>//$<span class="token punctuation">{</span>host.address<span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>host.port<span class="token punctuation">}</span>$<span class="token punctuation">{</span>path<span class="token punctuation">}</span>/`<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">createRouter</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">,</span> scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> <span class="token punctuation">{</span>cssPath<span class="token punctuation">,</span> jsPath<span class="token punctuation">}</span><span class="token punctuation"> = </span>conf<span class="token punctuation">;</span>
 <span class="token keyword">const</span> router<span class="token punctuation"> = </span>Express.<span class="token function">Router</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 router.<span class="token function">get</span><span class="token punctuation">(</span>"/"<span class="token punctuation">,</span> this.<span class="token function">middlewareIndex</span><span class="token punctuation">(</span>scope<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 router.<span class="token function">get</span><span class="token punctuation">(</span>"/swagger.json"<span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> res.<span class="token function">status</span><span class="token punctuation">(</span>200<span class="token punctuation">)</span>.<span class="token function">json</span><span class="token punctuation">(</span>scope.spec<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 router.<span class="token function">use</span><span class="token punctuation">(</span>Express.<span class="token keyword">static</span><span class="token punctuation">(</span>swaggerUiPath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>cssPath<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   router.<span class="token function">get</span><span class="token punctuation">(</span>"/main.css"<span class="token punctuation">,</span> this.<span class="token function">middlewareCss</span><span class="token punctuation">(</span>cssPath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span>jsPath<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   router.<span class="token function">get</span><span class="token punctuation">(</span>"/main.js"<span class="token punctuation">,</span> this.<span class="token function">middlewareJs</span><span class="token punctuation">(</span>jsPath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return router<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">middlewareRedirect</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 /* istanbul ignore next */
 return <span class="token punctuation">(</span>req<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>req.url === path && !req.url.<span class="token function">match</span><span class="token punctuation">(</span>/\/$/<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     res.<span class="token function">redirect</span><span class="token punctuation">(</span>path + "/"<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
     <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">middlewareIndex</span><span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 /* istanbul ignore next */
 return <span class="token punctuation">(</span>req<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> res<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span>
   ejs.<span class="token function">renderFile</span><span class="token punctuation">(</span>__dirname + "/../views/index.ejs"<span class="token punctuation">,</span> scope<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> str<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
     if <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       $log.<span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
       res.<span class="token function">status</span><span class="token punctuation">(</span>500<span class="token punctuation">)</span>.<span class="token function">send</span><span class="token punctuation">(</span>err.message<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
       res.<span class="token function">send</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
   <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>

</div>



:::