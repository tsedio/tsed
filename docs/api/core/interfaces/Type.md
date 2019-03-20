---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Type interface
---
# Type <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Type }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/interfaces/Type.ts#L0-L0">/packages/core/src/interfaces/Type.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> Type<span class="token punctuation">:</span> FunctionConstructor<span class="token punctuation">;</span>
<span class="token keyword">interface</span> Type&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token keyword">extends</span> Function <span class="token punctuation">{</span>
    new <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

An example of a `Type` is `MyCustomComponent` filters, which in JavaScript is be represented by
the `MyCustomComponent` constructor function.

:::