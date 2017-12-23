<header class="symbol-info-header">    <h1 id="isockethandlermetadata">ISocketHandlerMetadata</h1>    <label class="symbol-info-type-label interface">Interface</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ISocketHandlerMetadata }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/interfaces/ISocketHandlerMetadata.ts#L0-L0">                socketio/interfaces/ISocketHandlerMetadata.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> ISocketHandlerMetadata <span class="token punctuation">{</span>
    eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    parameters<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/socketio/isocketparammetadata"><span class="token">ISocketParamMetadata</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    returns?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        type<span class="token punctuation">:</span> <a href="#api/socketio/socketreturnstypes"><span class="token">SocketReturnsTypes</span></a><span class="token punctuation">;</span>
        eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">eventName<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">parameters<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/socketio/isocketparammetadata"><span class="token">ISocketParamMetadata</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">returns?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     type<span class="token punctuation">:</span> <a href="#api/socketio/socketreturnstypes"><span class="token">SocketReturnsTypes</span></a><span class="token punctuation">;</span>
     eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
