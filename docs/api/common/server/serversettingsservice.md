<header class="symbol-info-header">    <h1 id="serversettingsservice">ServerSettingsService</h1>    <label class="symbol-info-type-label service">Service</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ServerSettingsService }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.13.0/src/server/services/ServerSettingsService.ts#L0-L0">                server/services/ServerSettingsService.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> ServerSettingsService <span class="token keyword">implements</span> <a href="#api/common/server/iserversettings"><span class="token">IServerSettings</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>settings?<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> rootDir<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> version<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> env<span class="token punctuation">:</span> <a href="#api/common/core/env"><span class="token">Env</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> httpsOptions<span class="token punctuation">:</span> Https.ServerOptions<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token function">getHttpsPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> mount<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> serveStatic<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    get<T><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> authentification<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> routers<span class="token punctuation">:</span> <a href="#api/common/mvc/irouteroptions"><span class="token">IRouterOptions</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

`ServerSettingsService` contains all information about [ServerLoader](api/common/server/serverloader.md) configuration.

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> rootDir<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> version<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> env<span class="token punctuation">:</span> <a href="#api/common/core/env"><span class="token">Env</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> httpsOptions<span class="token punctuation">:</span> Https.ServerOptions</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">getHttpsPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> mount<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> serveStatic<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">get<T><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> authentification<span class="token punctuation">:</span> Function</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> routers<span class="token punctuation">:</span> <a href="#api/common/mvc/irouteroptions"><span class="token">IRouterOptions</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre></div>
