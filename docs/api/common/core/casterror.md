<header class="symbol-info-header">    <h1 id="casterror">CastError</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { CastError }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/core/errors/CastError"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/core/errors/CastError.ts#L0-L0">                core/errors/CastError.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> CastError <span class="token keyword">extends</span> InternalServerError <span class="token punctuation">{</span>
    origin<span class="token punctuation">:</span> Error<span class="token punctuation">;</span>
    stack<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>err<span class="token punctuation">:</span> Error<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">origin<span class="token punctuation">:</span> Error</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">stack<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
