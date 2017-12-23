<header class="symbol-info-header">    <h1 id="iinjectablemethod">IInjectableMethod</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IInjectableMethod }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/di/interfaces/IInjectableMethod.ts#L0-L0">                di/interfaces/IInjectableMethod.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IInjectableMethod<T> <span class="token punctuation">{</span>
    target?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><T><span class="token punctuation">;</span>
    methodName?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    locals?<span class="token punctuation">:</span> Map<Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">target?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><T></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">methodName?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">locals?<span class="token punctuation">:</span> Map<Function<span class="token punctuation">,</span> <span class="token keyword">any</span>></code></pre></div>
