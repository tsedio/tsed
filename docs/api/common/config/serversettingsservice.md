
<header class="symbol-info-header"><h1 id="serversettingsservice">ServerSettingsService</h1><label class="symbol-info-type-label service">Service</label><label class="api-type-label deprecated" title="deprecated">deprecated</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ServerSettingsService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.20.0/src//common/config/services/ServerSettingsService.ts#L0-L0">/common/config/services/ServerSettingsService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ServerSettingsService <span class="token keyword">implements</span> <a href="#api/common/config/iserversettings"><span class="token">IServerSettings</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    version<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    rootDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    httpsOptions<span class="token punctuation">:</span> Https.ServerOptions<span class="token punctuation">;</span>
    httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
    uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    env<span class="token punctuation">:</span> <a href="#api/core/env"><span class="token">Env</span></a><span class="token punctuation">;</span>
    mount<span class="token punctuation">:</span> <a href="#api/common/config/iservermountdirectories"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    serveStatic<span class="token punctuation">:</span> <a href="#api/common/config/iservermountdirectories"><span class="token">IServerMountDirectories</span></a><span class="token punctuation">;</span>
    acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    routers<span class="token punctuation">:</span> <a href="#api/common/config/iroutersettings"><span class="token">IRouterSettings</span></a><span class="token punctuation">;</span>
    validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    logger<span class="token punctuation">:</span> Partial<<a href="#api/common/config/iloggersettings"><span class="token">ILoggerSettings</span></a>><span class="token punctuation">;</span>
    exclude<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    controllerScope<span class="token punctuation">:</span> <a href="#api/common/di/providerscope"><span class="token">ProviderScope</span></a><span class="token punctuation">;</span>
    errors<span class="token punctuation">:</span> <a href="#api/common/config/ierrorssettings"><span class="token">IErrorsSettings</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getMetadata</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    $<span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerSettingsService<span class="token punctuation">;</span>
    <span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/common/config/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerSettingsService<span class="token punctuation">;</span>
    get<T><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
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


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">version<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">rootDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">httpsOptions<span class="token punctuation">:</span> Https.ServerOptions</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">httpPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">httpsPort<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">uploadDir<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">env<span class="token punctuation">:</span> <a href="#api/core/env"><span class="token">Env</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">mount<span class="token punctuation">:</span> <a href="#api/common/config/iservermountdirectories"><span class="token">IServerMountDirectories</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">componentsScan<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">serveStatic<span class="token punctuation">:</span> <a href="#api/common/config/iservermountdirectories"><span class="token">IServerMountDirectories</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">acceptMimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">debug<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">routers<span class="token punctuation">:</span> <a href="#api/common/config/iroutersettings"><span class="token">IRouterSettings</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">validationModelStrict<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">logger<span class="token punctuation">:</span> Partial<<a href="#api/common/config/iloggersettings"><span class="token">ILoggerSettings</span></a>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">exclude<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">controllerScope<span class="token punctuation">:</span> <a href="#api/common/di/providerscope"><span class="token">ProviderScope</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">errors<span class="token punctuation">:</span> <a href="#api/common/config/ierrorssettings"><span class="token">IErrorsSettings</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getMetadata</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang deprecated ">$<span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">forEach</span><span class="token punctuation">(</span>callbackfn<span class="token punctuation">:</span> <span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> map<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">,</span> thisArg?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/common/config/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">,</span> value?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">get<T><span class="token punctuation">(</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getHttpPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">setHttpPort</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getHttpsPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">setHttpsPort</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>
</div>








