---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation loadInjector function
---
# loadInjector <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { loadInjector }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/testing/loadInjector"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//testing/loadInjector.ts#L0-L0">/testing/loadInjector.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">loadInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> injector<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> hasExpress<span class="token punctuation"> = </span>injector.<span class="token function">has</span><span class="token punctuation">(</span><a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span>!hasExpress<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">expressApplication</span><span class="token punctuation">(</span>injector<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span>!injector.<span class="token function">has</span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpServer.html"><span class="token">HttpServer</span></a><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">createHttpServer</span><span class="token punctuation">(</span>injector<span class="token punctuation">,</span> 8080<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span>!injector.<span class="token function">has</span><span class="token punctuation">(</span><a href="/api/common/server/decorators/HttpsServer.html"><span class="token">HttpsServer</span></a><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">createHttpsServer</span><span class="token punctuation">(</span>injector<span class="token punctuation">,</span> <span class="token punctuation">{</span>port<span class="token punctuation">:</span> 8081<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span>!hasExpress<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    injector.get&lt<span class="token punctuation">;</span><a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span>!.env<span class="token punctuation"> = </span><a href="/api/core/interfaces/Env.html"><span class="token">Env</span></a>.TEST<span class="token punctuation">;</span>

    /* istanbul ignore next */
    injector.<span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>.<span class="token function">catch</span><span class="token punctuation">(</span>err =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      console.<span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
      process.<span class="token function">exit</span><span class="token punctuation">(</span>-1<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return injector<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Create a new HTTPs server.

`options` {IHTTPSServerOptions}:

- `port` &lt;number&gt;: Port number,
- `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
- `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
- `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
- `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.

See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).


:::