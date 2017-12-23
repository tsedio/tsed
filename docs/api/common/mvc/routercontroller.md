<header class="symbol-info-header">    <h1 id="routercontroller">RouterController</h1>    <label class="symbol-info-type-label service">Service</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { RouterController }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/services/RouterController.ts#L0-L0">                mvc/services/RouterController.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> RouterController <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>router<span class="token punctuation">:</span> Express.Router<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">getRouter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Express.Router<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

RouteController give the express Router use by the decorated controller.

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">getRouter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Express.Router</code></pre></div>
Return the Express.Router.
