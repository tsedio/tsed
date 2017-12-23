<header class="symbol-info-header">    <h1 id="onroutesinit">OnRoutesInit</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { OnRoutesInit }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/server/interfaces/OnRoutesInit.ts#L0-L0">                server/interfaces/OnRoutesInit.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">interface</span> OnRoutesInit <span class="token punctuation">{</span>
    $<span class="token function">onRoutesInit</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <a href="#api/common/server/icomponentscanned"><span class="token">IComponentScanned</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> | Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">$<span class="token function">onRoutesInit</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <a href="#api/common/server/icomponentscanned"><span class="token">IComponentScanned</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> | Promise<<span class="token keyword">any</span>></code></pre></div>
