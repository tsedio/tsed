<header class="symbol-info-header">    <h1 id="authenticatedmiddleware">AuthenticatedMiddleware</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label><label class="api-type-label middleware">middleware</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { AuthenticatedMiddleware }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/components/AuthenticatedMiddleware.ts#L0-L0">                mvc/components/AuthenticatedMiddleware.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> AuthenticatedMiddleware <span class="token keyword">implements</span> <a href="#api/common/mvc/imiddleware"><span class="token">IMiddleware</span></a> <span class="token punctuation">{</span>
    <span class="token function">use</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> request<span class="token punctuation">:</span> Express.<a href="#api/common/filters/request"><span class="token">Request</span></a><span class="token punctuation">,</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

This middleware manage the authentication.

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">use</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> request<span class="token punctuation">:</span> Express.<a href="#api/common/filters/request"><span class="token">Request</span></a><span class="token punctuation">,</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre></div>
