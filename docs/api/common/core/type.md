<header class="symbol-info-header">    <h1 id="type">Type</h1>    <label class="symbol-info-type-label interface">Interface</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Type }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/core/interfaces/Type.ts#L0-L0">                core/interfaces/Type.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">const</span> Type<span class="token punctuation">:</span> FunctionConstructor<span class="token punctuation">;</span>
<span class="token keyword">interface</span> Type<T> <span class="token keyword">extends</span> Function <span class="token punctuation">{</span>
    new <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Description

An example of a `Type` is `MyCustomComponent` filters, which in JavaScript is be represented by
the `MyCustomComponent` constructor function.
