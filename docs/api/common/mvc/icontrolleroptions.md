<header class="symbol-info-header">    <h1 id="icontrolleroptions">IControllerOptions</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IControllerOptions }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/interfaces/IControllerOptions.ts#L0-L0">                mvc/interfaces/IControllerOptions.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IControllerOptions <span class="token punctuation">{</span>
    path?<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a><span class="token punctuation">;</span>
    dependencies?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    routerOptions?<span class="token punctuation">:</span> <a href="#api/common/irouteroptions"><span class="token">IRouterOptions</span></a><span class="token punctuation">;</span>
    middlewares?<span class="token punctuation">:</span> <a href="#api/common/mvc/icontrollermiddlewares"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">path?<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">dependencies?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">routerOptions?<span class="token punctuation">:</span> <a href="#api/common/irouteroptions"><span class="token">IRouterOptions</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">middlewares?<span class="token punctuation">:</span> <a href="#api/common/mvc/icontrollermiddlewares"><span class="token">IControllerMiddlewares</span></a></code></pre></div>
