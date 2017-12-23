<header class="symbol-info-header">    <h1 id="openapipropertiesbuilder">OpenApiPropertiesBuilder</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { OpenApiPropertiesBuilder }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/swagger/class/OpenApiPropertiesBuilder"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/swagger/class/OpenApiPropertiesBuilder.ts#L0-L0">                swagger/class/OpenApiPropertiesBuilder.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> OpenApiPropertiesBuilder <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>definitionsName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>responseName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/common/core/storable"><span class="token">Storable</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token function">getJsonSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> responses<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>responseName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

Builder a Schema from a target.

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>definitionsName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>responseName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/common/core/storable"><span class="token">Storable</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">getJsonSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/swagger/schema"><span class="token">Schema</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> responses<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>responseName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="#api/common/filters/response"><span class="token">Response</span></a><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
