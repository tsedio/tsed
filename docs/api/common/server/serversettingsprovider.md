<header class="symbol-info-header">    <h1 id="serversettingsprovider">ServerSettingsProvider</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ServerSettingsProvider }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/server/class/ServerSettingsProvider"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.13.0/src/server/class/ServerSettingsProvider.ts#L0-L0">                server/class/ServerSettingsProvider.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> ServerSettingsProvider <span class="token keyword">implements</span> <a href="#api/common/server/iserversettings"><span class="token">IServerSettings</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    version<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    rootDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    httpsOptions<span class="token punctuation">:</span> Https.ServerOptions<span class="token punctuation">;</span>
    httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    env<span class="token punctuation">:</span> <a href="#api/common/core/env"><span class="token">Env</span></a><span class="token punctuation">;</span>
    authentification<span class="token punctuation">:</span> <span class="token punctuation">(</span>request?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    mount<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    serveStatic<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    routers<span class="token punctuation">:</span> <a href="#api/common/mvc/irouteroptions"><span class="token">IRouterOptions</span></a><span class="token punctuation">;</span>
    validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/common/server/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerSettingsProvider<span class="token punctuation">;</span>
    <span class="token function">get</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    $get<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> => <a href="#api/common/server/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getMetadata</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">version<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">rootDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">httpsOptions<span class="token punctuation">:</span> Https.ServerOptions</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">env<span class="token punctuation">:</span> <a href="#api/common/core/env"><span class="token">Env</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">authentification<span class="token punctuation">:</span> <span class="token punctuation">(</span>request?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">mount<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">serveStatic<span class="token punctuation">:</span> <a href="#api/common/server/iservermountdirectories"><span class="token">IServerMountDirectories</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">routers<span class="token punctuation">:</span> <a href="#api/common/mvc/irouteroptions"><span class="token">IRouterOptions</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/common/server/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serversettingsprovider"><span class="token">ServerSettingsProvider</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">get</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$get<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> => <a href="#api/common/server/serversettingsservice"><span class="token">ServerSettingsService</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">static</span> <span class="token function">getMetadata</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
