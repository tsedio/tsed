<header class="symbol-info-header">    <h1 id="iparamargs">IParamArgs</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IParamArgs }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/filters/interfaces/Arguments.ts#L0-L0">                filters/interfaces/Arguments.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IParamArgs<T> <span class="token keyword">extends</span> <a href="#api/common/filters/imethodargs"><span class="token">IMethodArgs</span></a><T> <span class="token punctuation">{</span>
    parameterIndex<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">parameterIndex<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
