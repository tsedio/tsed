<header class="symbol-info-header">    <h1 id="iserverlifecycle">IServerLifecycle</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IServerLifecycle }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.0.9/src/server/interfaces/IServerLifeCycle.ts#L0-L0">                server/interfaces/IServerLifeCycle.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IServerLifecycle <span class="token punctuation">{</span>
    version<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    $onInit?<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> | Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    $onMountingMiddlewares?<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    $afterRoutesInit?<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    $onReady?<span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
    $onServerInitError?<span class="token punctuation">(</span>error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    $onError?<span class="token punctuation">(</span>error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/request"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/response"><span class="token">Response</span></a><span class="token punctuation">,</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    $onAuth?<span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/request"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/response"><span class="token">Response</span></a><span class="token punctuation">,</span> next?<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">,</span> authorization?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> | <span class="token keyword">void</span><span class="token punctuation">;</span>
    $onAuth?<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> | <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

ServerLoader lifecycle let you intercept a phase.

### Members

<div class="method-overview"><pre><code class="typescript-lang">version<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onInit?<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> | Promise<<span class="token keyword">any</span>></code></pre></div>
This method is called when the server starting his lifecycle.
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onMountingMiddlewares?<span class="token punctuation">:</span> Function</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$afterRoutesInit?<span class="token punctuation">:</span> Function</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onReady?<span class="token punctuation">:</span> Function</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onServerInitError?<span class="token punctuation">(</span>error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onError?<span class="token punctuation">(</span>error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/request"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/response"><span class="token">Response</span></a><span class="token punctuation">,</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onAuth?<span class="token punctuation">(</span>request<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/request"><span class="token">Request</span></a><span class="token punctuation">,</span> response<span class="token punctuation">:</span> Express.<a href="#api/common/mvc/response"><span class="token">Response</span></a><span class="token punctuation">,</span> next?<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">,</span> authorization?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> | <span class="token keyword">void</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$onAuth?<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> | <span class="token keyword">void</span></code></pre></div>
