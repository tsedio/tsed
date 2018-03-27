
<header class="symbol-info-header"><h1 id="type">Type</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Type }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//core/interfaces/Type.ts#L0-L0">/core/interfaces/Type.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> Type<span class="token punctuation">:</span> FunctionConstructor<span class="token punctuation">;</span>
<span class="token keyword">interface</span> Type<T> <span class="token keyword">extends</span> Function <span class="token punctuation">{</span>
    new <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

An example of a `Type` is `MyCustomComponent` filters, which in JavaScript is be represented by
the `MyCustomComponent` constructor function.

<!-- Members -->

