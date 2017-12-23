<header class="symbol-info-header">    <h1 id="isocketprovidermetadata">ISocketProviderMetadata</h1>    <label class="symbol-info-type-label interface">Interface</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ISocketProviderMetadata }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/interfaces/ISocketProviderMetadata.ts#L0-L0">                socketio/interfaces/ISocketProviderMetadata.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> ISocketProviderMetadata <span class="token punctuation">{</span>
    namespace<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    injectNamespace<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/socketio/isockethandlermetadata"><span class="token">ISocketHandlerMetadata</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">namespace<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">injectNamespace<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">handlers<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/socketio/isockethandlermetadata"><span class="token">ISocketHandlerMetadata</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
