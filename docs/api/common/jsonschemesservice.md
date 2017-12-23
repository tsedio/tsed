<header class="symbol-info-header">    <h1 id="jsonschemesservice">JsonSchemesService</h1>    <label class="symbol-info-type-label service">Service</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { JsonSchemesService }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/jsonschema"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/jsonschema/services/JsonSchemesService.ts#L0-L0">                jsonschema/services/JsonSchemesService.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> JsonSchemesService <span class="token keyword">extends</span> <a href="#api/common/core/proxyregistry"><span class="token">ProxyRegistry</span></a><<span class="token keyword">any</span><span class="token punctuation">,</span> <a href="#api/common/jsonschema"><span class="token">JsonSchema</span></a>> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">getSchemaDefinition</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">getSchemaDefinition</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema4</code></pre></div>
