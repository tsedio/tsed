<header class="symbol-info-header">    <h1 id="storable">Storable</h1>    <label class="symbol-info-type-label class">Class</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Storable }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/core/class/Storable"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/core/class/Storable.ts#L0-L0">                core/class/Storable.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">abstract</span> <span class="token keyword">class</span> Storable <span class="token keyword">extends</span> <a href="#api/common/core/entitydescription"><span class="token">EntityDescription</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _store<span class="token punctuation">:</span> <a href="#api/common/core/store"><span class="token">Store</span></a><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>_target<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> _propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> _index?<span class="token punctuation">:</span> <span class="token keyword">number</span> | PropertyDescriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> store<span class="token punctuation">:</span> <a href="#api/common/core/store"><span class="token">Store</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">protected</span> _store<span class="token punctuation">:</span> <a href="#api/common/core/store"><span class="token">Store</span></a></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token keyword">readonly</span> store<span class="token punctuation">:</span> <a href="#api/common/core/store"><span class="token">Store</span></a></code></pre></div>
