<header class="symbol-info-header">    <h1 id="ihandlerscope">IHandlerScope</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IHandlerScope }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.15.2/src/mvc/interfaces/IHandlerScope.ts#L0-L0">                mvc/interfaces/IHandlerScope.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IHandlerScope <span class="token punctuation">{</span>
    request<span class="token punctuation">:</span> Express.<a href="#api/common/filters/request"><span class="token">Request</span></a><span class="token punctuation">;</span>
    response<span class="token punctuation">:</span> Express.<a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
    next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">;</span>
    err?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token punctuation">[</span>service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">request<span class="token punctuation">:</span> Express.<a href="#api/common/filters/request"><span class="token">Request</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">response<span class="token punctuation">:</span> Express.<a href="#api/common/filters/response"><span class="token">Response</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">next<span class="token punctuation">:</span> Express.NextFunction</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">err?<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token punctuation">[</span>service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
