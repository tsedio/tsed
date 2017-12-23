<header class="symbol-info-header">    <h1 id="parseservice">ParseService</h1>    <label class="symbol-info-type-label service">Service</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ParseService }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/filters/services/ParseService.ts#L0-L0">                filters/services/ParseService.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> ParseService <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> clone<span class="token punctuation">:</span> <span class="token punctuation">(</span>src<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">eval</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> clone?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">static</span> clone<span class="token punctuation">:</span> <span class="token punctuation">(</span>src<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">any</span></code></pre></div>
Clone an object.
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">eval</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> scope<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> clone?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
Eval an expression with a scope context and return value.
