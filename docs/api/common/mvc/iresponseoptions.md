<header class="symbol-info-header">    <h1 id="iresponseoptions">IResponseOptions</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { IResponseOptions }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/interfaces/IResponseOptions.ts#L0-L0">                mvc/interfaces/IResponseOptions.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> IResponseOptions <span class="token punctuation">{</span>
    use?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    type?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    collection?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    collectionType?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    description?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    examples?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>exampleName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    headers?<span class="token punctuation">:</span> <a href="#api/common/mvc/iresponseheaders"><span class="token">IResponseHeaders</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><del>use?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>></del></code></pre></div>
Use IResponseOptions.type instead of
<hr />
<div class="method-overview"><pre><code class="typescript-lang">type?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><del>collection?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>></del></code></pre></div>
Use IResponseOptions.collectionType instead of
<hr />
<div class="method-overview"><pre><code class="typescript-lang">collectionType?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">description?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">examples?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>exampleName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">headers?<span class="token punctuation">:</span> <a href="#api/common/mvc/iresponseheaders"><span class="token">IResponseHeaders</span></a></code></pre></div>
