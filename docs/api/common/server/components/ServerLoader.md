---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ServerLoader class
---
# ServerLoader <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ServerLoader }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/server/components/ServerLoader.ts#L0-L0">/common/server/components/ServerLoader.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> ServerLoader <span class="token keyword">implements</span> <a href="/api/common/server/interfaces/IServerLifecycle.html"><span class="token">IServerLifecycle</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">public</span> version<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span>"4.30.1"<span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._injector<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.<span class="token function">createExpressApplication</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> settings<span class="token punctuation"> = </span><a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a>.<span class="token function">getMetadata</span><span class="token punctuation">(</span>this<span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span><span class="token punctuation">(</span>this <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>.$onAuth<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      $log.<span class="token function">warn</span><span class="token punctuation">(</span>"The $onAuth hooks is removed. <a href="/api/common/mvc/decorators/method/Use.html"><span class="token">Use</span></a> <a href="/api/common/mvc/decorators/class/OverrideMiddleware.html"><span class="token">OverrideMiddleware</span></a> method instead of. See https<span class="token punctuation">:</span>//goo.gl/fufBTE."<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>settings<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.<span class="token function">setSettings</span><span class="token punctuation">(</span>settings<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">createExpressApplication</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader <span class="token punctuation">{</span>
    <span class="token keyword">const</span> expressApp<span class="token punctuation"> = </span><span class="token function">Express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> originalUse<span class="token punctuation"> = </span>expressApp.use<span class="token punctuation">;</span>
    <span class="token keyword">const</span> injector<span class="token punctuation"> = </span>this.injector<span class="token punctuation">;</span>
    expressApp.use<span class="token punctuation"> = </span><span class="token function">function</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      args<span class="token punctuation"> = </span>args.<span class="token function">map</span><span class="token punctuation">(</span>arg =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        if <span class="token punctuation">(</span>injector.<span class="token function">has</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          arg<span class="token punctuation"> = </span><a href="/api/common/mvc/class/HandlerBuilder.html"><span class="token">HandlerBuilder</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span>.<span class="token function">build</span><span class="token punctuation">(</span>injector<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        return arg<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      return originalUse.<span class="token function">call</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> ...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    this.injector.<span class="token function">forkProvider</span><span class="token punctuation">(</span><a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a><span class="token punctuation">,</span> expressApp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">createHttpServer</span><span class="token punctuation">(</span>port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader <span class="token punctuation">{</span>
    <span class="token keyword">const</span> httpServer<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>Http.<span class="token function">createServer</span><span class="token punctuation">(</span>this.expressApp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    // TODO to be removed
    /* istanbul ignore next */
    httpServer.get<span class="token punctuation"> = </span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> httpServer<span class="token punctuation">;</span>
    this.injector.<span class="token function">forkProvider</span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">,</span> httpServer<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.settings.httpPort<span class="token punctuation"> = </span>port<span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">createHttpsServer</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="/api/common/server/interfaces/IHTTPSServerOptions.html"><span class="token">IHTTPSServerOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader <span class="token punctuation">{</span>
    <span class="token keyword">const</span> httpsServer<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>Https.<span class="token function">createServer</span><span class="token punctuation">(</span>options<span class="token punctuation">,</span> this.expressApp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    // TODO to be removed
    /* istanbul ignore next */
    httpsServer.get<span class="token punctuation"> = </span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> httpsServer<span class="token punctuation">;</span>
    this.injector.<span class="token function">forkProvider</span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">,</span> httpsServer<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.settings.httpsPort<span class="token punctuation"> = </span>options.port<span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader <span class="token punctuation">{</span>
    this.expressApp.<span class="token function">use</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">set</span><span class="token punctuation">(</span>setting<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> val<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader <span class="token punctuation">{</span>
    this.expressApp.<span class="token function">set</span><span class="token punctuation">(</span>setting<span class="token punctuation">,</span> val<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">engine</span><span class="token punctuation">(</span>ext<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> fn<span class="token punctuation">:</span> Function<span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader <span class="token punctuation">{</span>
    this.expressApp.<span class="token function">engine</span><span class="token punctuation">(</span>ext<span class="token punctuation">,</span> fn<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> async <span class="token function">loadSettingsAndInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    $log.<span class="token function">debug</span><span class="token punctuation">(</span>"Initialize settings"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.settings.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      $log.<span class="token function">info</span><span class="token punctuation">(</span>`settings.$<span class="token punctuation">{</span>key<span class="token punctuation">}</span> =&gt<span class="token punctuation">;</span>`<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    $log.<span class="token function">info</span><span class="token punctuation">(</span>"Build services"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this.injector.<span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> callHook<span class="token punctuation"> = </span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> elseFn<span class="token punctuation"> = </span>new <span class="token function">Function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> self<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>this<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>key in this<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      $log.<span class="token function">debug</span><span class="token punctuation">(</span>`\x1B<span class="token punctuation">[</span>1mCall hook $<span class="token punctuation">{</span>key<span class="token punctuation">}</span>\x1B<span class="token punctuation">[</span>22m`<span class="token punctuation">)</span><span class="token punctuation">;</span>
      return self<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return <span class="token function">elseFn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Deprecated.html"><span class="token">Deprecated</span></a></span><span class="token punctuation">(</span>"Removed feature. <a href="/api/common/mvc/decorators/method/Use.html"><span class="token">Use</span></a> ServerLoader.settings"<span class="token punctuation">)</span>
  <span class="token keyword">protected</span> <span class="token function">getSettingsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a> <span class="token punctuation">{</span>
    return this.settings<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> async <span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> start<span class="token punctuation"> = </span>new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    try <span class="token punctuation">{</span>
      <span class="token keyword">const</span> debug<span class="token punctuation"> = </span>this.settings.debug<span class="token punctuation">;</span>
      /* istanbul ignore next */
      if <span class="token punctuation">(</span>debug && this.settings.env !== <span class="token string">"test"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        $log.level<span class="token punctuation"> = </span><span class="token string">"debug"</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      await Promise.<span class="token function">all</span><span class="token punctuation">(</span>this._scannedPromises<span class="token punctuation">)</span><span class="token punctuation">;</span>
      await this.<span class="token function">callHook</span><span class="token punctuation">(</span>"$onInit"<span class="token punctuation">)</span><span class="token punctuation">;</span>
      await this.<span class="token function">loadSettingsAndInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      $log.<span class="token function">debug</span><span class="token punctuation">(</span>"Settings and injector loaded"<span class="token punctuation">)</span><span class="token punctuation">;</span>
      await this.<span class="token function">loadMiddlewares</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      await this.<span class="token function">startServers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      await this.<span class="token function">callHook</span><span class="token punctuation">(</span>"$onReady"<span class="token punctuation">)</span><span class="token punctuation">;</span>
      await this.injector.<span class="token function">emit</span><span class="token punctuation">(</span>"$onServerReady"<span class="token punctuation">)</span><span class="token punctuation">;</span>
      $log.<span class="token function">info</span><span class="token punctuation">(</span>`Started in $<span class="token punctuation">{</span>new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> - start.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span> ms`<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> catch <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.<span class="token function">callHook</span><span class="token punctuation">(</span>"$onServerInitError"<span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">;</span>
      return Promise.<span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">protected</span> <span class="token function">startServer</span><span class="token punctuation">(</span>
    http<span class="token punctuation">:</span> Http.Server | Https.Server<span class="token punctuation">,</span>
    settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>https<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span> address<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span> port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

ServerLoader provider all method to instantiate an ExpressServer.

It provide some features :

* [Lifecycle hooks](/docs/services.md/lifecycle-hooks),
* [Versioning Api](/docs/server-loader/versioning.md),
* [Authentication strategy](/docs/server-loader/authentication.md).
* [Global errors handler](/docs/server-loader/global-error-handler.md),
* Middleware importation,
* Scan directory. You can specify controllers and services directory in your project,

```typescript
// In server.ts
import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
@ServerSettings({
   rootDir: Path.resolve(__dirname),
   port: 8000,
   httpsPort: 8080,
   mount: {
     "/rest": "${rootDir}/controllers/**/*.js"
   }
})
export class Server extends ServerLoader {

    $onReady(){
        console.log('Server started...');
    }

    $onServerInitError(err){
        console.error(err);
    }
}

// In app.ts
import Server from "./server";
new Server()
    .start()
    .then(() => console.log('started'))
    .catch(er => console.error(er));

```


:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> version<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span>"4.30.1"</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">createExpressApplication</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> expressApp<span class="token punctuation"> = </span><span class="token function">Express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> originalUse<span class="token punctuation"> = </span>expressApp.use<span class="token punctuation">;</span>
 <span class="token keyword">const</span> injector<span class="token punctuation"> = </span>this.injector<span class="token punctuation">;</span>
 expressApp.use<span class="token punctuation"> = </span><span class="token function">function</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   args<span class="token punctuation"> = </span>args.<span class="token function">map</span><span class="token punctuation">(</span>arg =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
     if <span class="token punctuation">(</span>injector.<span class="token function">has</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
       arg<span class="token punctuation"> = </span><a href="/api/common/mvc/class/HandlerBuilder.html"><span class="token">HandlerBuilder</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span>.<span class="token function">build</span><span class="token punctuation">(</span>injector<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
     return arg<span class="token punctuation">;</span>
   <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   return originalUse.<span class="token function">call</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> ...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span>
 this.injector.<span class="token function">forkProvider</span><span class="token punctuation">(</span><a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a><span class="token punctuation">,</span> expressApp<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">createHttpServer</span><span class="token punctuation">(</span>port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> httpServer<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>Http.<span class="token function">createServer</span><span class="token punctuation">(</span>this.expressApp<span class="token punctuation">)</span><span class="token punctuation">;</span>
 // TODO to be removed
 /* istanbul ignore next */
 httpServer.get<span class="token punctuation"> = </span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> httpServer<span class="token punctuation">;</span>
 this.injector.<span class="token function">forkProvider</span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">,</span> httpServer<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.settings.httpPort<span class="token punctuation"> = </span>port<span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Create a new HTTP server with the provided `port`.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">createHttpsServer</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="/api/common/server/interfaces/IHTTPSServerOptions.html"><span class="token">IHTTPSServerOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> httpsServer<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>Https.<span class="token function">createServer</span><span class="token punctuation">(</span>options<span class="token punctuation">,</span> this.expressApp<span class="token punctuation">)</span><span class="token punctuation">;</span>
 // TODO to be removed
 /* istanbul ignore next */
 httpsServer.get<span class="token punctuation"> = </span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> httpsServer<span class="token punctuation">;</span>
 this.injector.<span class="token function">forkProvider</span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">,</span> httpsServer<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.settings.httpsPort<span class="token punctuation"> = </span>options.port<span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 options|<code>&lt;a href="/api/common/server/interfaces/IHTTPSServerOptions.html"&gt;&lt;span class="token"&gt;IHTTPSServerOptions&lt;/span&gt;&lt;/a&gt;</code>|Options to create new HTTPS server. 





Create a new HTTPs server.

`options` {IHTTPSServerOptions}:

- `port` &lt;number&gt;: Port number,
- `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
- `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
- `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
- `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.

See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">use</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a> <span class="token punctuation">{</span>
 this.expressApp.<span class="token function">use</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



This method let you to add a express middleware or a Ts.ED middleware like GlobalAcceptMimes.

```typescript
@ServerSettings({
   rootDir,
   acceptMimes: ['application/json'] // optional
})
export class Server extends ServerLoader {
    $onMountingMiddlewares(): void|Promise<any> {
        const methodOverride = require('method-override');

        this.use(GlobalAcceptMimesMiddleware)
            .use(methodOverride());

        // similar to
        this.expressApp.use(methodOverride());

        // but not similar to
        this.expressApp.use(GlobalAcceptMimesMiddleware); // in this case, this middleware will not be added correctly to express.

        return null;
    }
}
```



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">set</span><span class="token punctuation">(</span>setting<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> val<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a> <span class="token punctuation">{</span>
 this.expressApp.<span class="token function">set</span><span class="token punctuation">(</span>setting<span class="token punctuation">,</span> val<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Proxy to express set



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">engine</span><span class="token punctuation">(</span>ext<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> fn<span class="token punctuation">:</span> Function<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a> <span class="token punctuation">{</span>
 this.expressApp.<span class="token function">engine</span><span class="token punctuation">(</span>ext<span class="token punctuation">,</span> fn<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Proxy to express engine



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> async <span class="token function">loadSettingsAndInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 $log.<span class="token function">debug</span><span class="token punctuation">(</span>"Initialize settings"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.settings.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> key<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   $log.<span class="token function">info</span><span class="token punctuation">(</span>`settings.$<span class="token punctuation">{</span>key<span class="token punctuation">}</span> =&gt<span class="token punctuation">;</span>`<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 $log.<span class="token function">info</span><span class="token punctuation">(</span>"Build services"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this.injector.<span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> callHook<span class="token punctuation"> = </span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> elseFn<span class="token punctuation"> = </span>new <span class="token function">Function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> self<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>this<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>key in this<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   $log.<span class="token function">debug</span><span class="token punctuation">(</span>`\x1B<span class="token punctuation">[</span>1mCall hook $<span class="token punctuation">{</span>key<span class="token punctuation">}</span>\x1B<span class="token punctuation">[</span>22m`<span class="token punctuation">)</span><span class="token punctuation">;</span>
   return self<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return <span class="token function">elseFn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Deprecated.html"><span class="token">Deprecated</span></a></span><span class="token punctuation">(</span>"Removed feature. <a href="/api/common/mvc/decorators/method/Use.html"><span class="token">Use</span></a> <a href="/api/common/server/components/ServerLoader.html"><span class="token">ServerLoader</span></a>.settings"<span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">getSettingsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a> <span class="token punctuation">{</span>
 return this.settings<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> async <span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> start<span class="token punctuation"> = </span>new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 try <span class="token punctuation">{</span>
   <span class="token keyword">const</span> debug<span class="token punctuation"> = </span>this.settings.debug<span class="token punctuation">;</span>
   /* istanbul ignore next */
   if <span class="token punctuation">(</span>debug && this.settings.env !== <span class="token string">"test"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     $log.level<span class="token punctuation"> = </span><span class="token string">"debug"</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   await Promise.<span class="token function">all</span><span class="token punctuation">(</span>this._scannedPromises<span class="token punctuation">)</span><span class="token punctuation">;</span>
   await this.<span class="token function">callHook</span><span class="token punctuation">(</span>"$onInit"<span class="token punctuation">)</span><span class="token punctuation">;</span>
   await this.<span class="token function">loadSettingsAndInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   $log.<span class="token function">debug</span><span class="token punctuation">(</span>"Settings and injector loaded"<span class="token punctuation">)</span><span class="token punctuation">;</span>
   await this.<span class="token function">loadMiddlewares</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   await this.<span class="token function">startServers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   await this.<span class="token function">callHook</span><span class="token punctuation">(</span>"$onReady"<span class="token punctuation">)</span><span class="token punctuation">;</span>
   await this.injector.<span class="token function">emit</span><span class="token punctuation">(</span>"$onServerReady"<span class="token punctuation">)</span><span class="token punctuation">;</span>
   $log.<span class="token function">info</span><span class="token punctuation">(</span>`Started in $<span class="token punctuation">{</span>new <span class="token keyword">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> - start.<span class="token function">getTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span> ms`<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span> catch <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this.<span class="token function">callHook</span><span class="token punctuation">(</span>"$onServerInitError"<span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">;</span>
   return Promise.<span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Start the express server.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">startServer</span><span class="token punctuation">(</span></code></pre>

</div>



Create a new server from settings parameters.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">http<span class="token punctuation">:</span> Http.Server | Https.Server<span class="token punctuation">,</span></code></pre>

</div>



:::