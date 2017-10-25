<header class="symbol-info-header">    <h1 id="parammetadata">ParamMetadata</h1>    <label class="symbol-info-type-label class">Class</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ParamMetadata }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.7.2/src/mvc/class/ParamMetadata.ts#L0-L0">                mvc/class/ParamMetadata.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> ParamMetadata <span class="token keyword">extends</span> <a href="#api/common/core/storable"><span class="token">Storable</span></a> <span class="token keyword">implements</span> <a href="#api/common/mvc/iparamoptions"><span class="token">IParamOptions</span></a><<span class="token keyword">any</span>> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol<span class="token punctuation">;</span>
    expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    service<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol<span class="token punctuation">;</span>
    useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
        required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
        use<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        baseType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">service<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
     required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
     use<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     baseType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
