<header class="symbol-info-header">    <h1 id="ifilterprehandler">IFilterPreHandler</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IFilterPreHandler }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/filters/interfaces/IFilterPreHandler.ts#L0-L0">                filters/interfaces/IFilterPreHandler.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IFilterPreHandler <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <a href="#api/common/filters/ifilterscope"><span class="token">IFilterScope</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    param?<span class="token punctuation">:</span> <a href="#api/common/filters/parammetadata"><span class="token">ParamMetadata</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token punctuation">(</span>scope<span class="token punctuation">:</span> <a href="#api/common/filters/ifilterscope"><span class="token">IFilterScope</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">param?<span class="token punctuation">:</span> <a href="#api/common/filters/parammetadata"><span class="token">ParamMetadata</span></a></code></pre></div>
