<header class="symbol-info-header">    <h1 id="symbolconverter">SymbolConverter</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label><label class="api-type-label converter">converter</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { SymbolConverter }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/converters/components/SymbolConverter"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/converters/components/SymbolConverter.ts#L0-L0">                converters/components/SymbolConverter.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> SymbolConverter <span class="token keyword">implements</span> <a href="#api/common/converters/iconverter"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
    <span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> symbol<span class="token punctuation">;</span>
    <span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> Symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> symbol</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> Symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
