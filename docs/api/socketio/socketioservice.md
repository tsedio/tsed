
<header class="symbol-info-header"><h1 id="socketioservice">SocketIOService</h1><label class="symbol-info-type-label service">Service</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SocketIOService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//socketio/services/SocketIOService.ts#L0-L0">/socketio/services/SocketIOService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SocketIOService <span class="token keyword">implements</span> <a href="#api/common/server/onserverready"><span class="token">OnServerReady</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>httpServer<span class="token punctuation">:</span> <a href="#api/common/server/httpserver"><span class="token">HttpServer</span></a><span class="token punctuation">,</span> httpsServer<span class="token punctuation">:</span> <a href="#api/common/server/httpsserver"><span class="token">HttpsServer</span></a><span class="token punctuation">,</span> io<span class="token punctuation">:</span> SocketIO.Server<span class="token punctuation">,</span> serverSettingsService<span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    $<span class="token function">onServerReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">getWebsocketServices</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/providerstorable"><span class="token">ProviderStorable</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">onServerReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getWebsocketServices</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/di/providerstorable"><span class="token">ProviderStorable</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>








