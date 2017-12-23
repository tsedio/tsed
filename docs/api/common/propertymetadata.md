<header class="symbol-info-header">    <h1 id="propertymetadata">PropertyMetadata</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { PropertyMetadata }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/jsonschema/class/PropertyMetadata"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/jsonschema/class/PropertyMetadata.ts#L0-L0">                jsonschema/class/PropertyMetadata.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> PropertyMetadata <span class="token keyword">extends</span> <a href="#api/common/core/storable"><span class="token">Storable</span></a> <span class="token keyword">implements</span> <a href="#api/common/converters/ipropertyoptions"><span class="token">IPropertyOptions</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    type<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> <a href="#api/common/jsonschema"><span class="token">JsonSchema</span></a><span class="token punctuation">;</span>
    required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Constructor

Allowed value when the entity is required.

### Members

<div class="method-overview"><pre><code class="typescript-lang">type<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> <a href="#api/common/jsonschema"><span class="token">JsonSchema</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">required<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
Change the state of the required data.
<hr />
<div class="method-overview"><pre><code class="typescript-lang">allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
Set the allowed values when the value is required.
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
