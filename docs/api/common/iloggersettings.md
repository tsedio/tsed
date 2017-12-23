<header class="symbol-info-header">    <h1 id="iloggersettings">ILoggerSettings</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ILoggerSettings }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/config"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/config/interfaces/IServerSettings.ts#L0-L0">                config/interfaces/IServerSettings.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> ILoggerSettings <span class="token punctuation">{</span>
    debug?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    requestFields?<span class="token punctuation">:</span> <span class="token punctuation">(</span>"reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration"<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    logRequest?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    reqIdBuilder<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> => <span class="token keyword">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">debug?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">requestFields?<span class="token punctuation">:</span> <span class="token punctuation">(</span>"reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration"<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">logRequest?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">reqIdBuilder<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> => <span class="token keyword">number</span></code></pre></div>
