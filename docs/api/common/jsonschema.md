<header class="symbol-info-header">    <h1 id="jsonschema">JsonSchema</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { JsonSchema }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/jsonschema/class/JsonSchema"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/jsonschema/class/JsonSchema.ts#L0-L0">                jsonschema/class/JsonSchema.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> JsonSchema <span class="token keyword">implements</span> JSONSchema4 <span class="token punctuation">{</span>
    $id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    properties<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    $ref<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    $schema<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    title<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    description<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    default<span class="token punctuation">:</span> JSONSchema4Type<span class="token punctuation">;</span>
    multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    maximum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    exclusiveMaximum<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    minimum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    exclusiveMinimum<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    maxLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    minLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    pattern<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    additionalItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | JSONSchema4<span class="token punctuation">;</span>
    items<span class="token punctuation">:</span> JSONSchema4 | JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    minItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    uniqueItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    minProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    required<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    additionalProperties<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | JSONSchema4<span class="token punctuation">;</span>
    definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    patternProperties<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    dependencies<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4 | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    enum<span class="token punctuation">:</span> JSONSchema4Type<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    allOf<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    anyOf<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    oneOf<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    not<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
    <span class="token keyword">extends</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    format<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    type<span class="token punctuation">:</span> <span class="token keyword">any</span> | JSONSchema4TypeName | JSONSchema4TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> refName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getJsonType</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema4TypeName | JSONSchema4TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">$id<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">properties<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">id<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$ref<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">$schema<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">title<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">description<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">default<span class="token punctuation">:</span> JSONSchema4Type</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">maximum<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">exclusiveMaximum<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">minimum<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">exclusiveMinimum<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">maxLength<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">minLength<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">pattern<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">additionalItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | JSONSchema4</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">items<span class="token punctuation">:</span> JSONSchema4 | JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">minItems<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">uniqueItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">minProperties<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">required<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">additionalProperties<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | JSONSchema4</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">patternProperties<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">dependencies<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> JSONSchema4 | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">enum<span class="token punctuation">:</span> JSONSchema4Type<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">allOf<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">anyOf<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">oneOf<span class="token punctuation">:</span> JSONSchema4<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">not<span class="token punctuation">:</span> JSONSchema4</code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">extends</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">format<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang">type<span class="token punctuation">:</span> <span class="token keyword">any</span> | JSONSchema4TypeName | JSONSchema4TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> refName<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">static</span> <span class="token function">getJsonType</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema4TypeName | JSONSchema4TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">static</span> <span class="token function">ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema4</code></pre></div>
