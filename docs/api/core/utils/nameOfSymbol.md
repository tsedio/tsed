---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation nameOfSymbol const
---
# nameOfSymbol <Badge text="Constant" type="const"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { nameOfSymbol }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//core/utils/ObjectUtils.ts#L0-L0">/core/utils/ObjectUtils.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> nameOfSymbol<span class="token punctuation"> = </span><span class="token punctuation">(</span>sym<span class="token punctuation">:</span> symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> =&gt<span class="token punctuation">;</span>
  sym
    .<span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    .<span class="token function">replace</span><span class="token punctuation">(</span>"<span class="token function">Symbol</span><span class="token punctuation">(</span>"<span class="token punctuation">,</span> ""<span class="token punctuation">)</span>
    .<span class="token function">replace</span><span class="token punctuation">(</span>"<span class="token punctuation">)</span>"<span class="token punctuation">,</span> ""<span class="token punctuation">)</span><span class="token punctuation">;</span>

/**
 *
 * @param target
 * @param <span class="token punctuation">{</span><span class="token keyword">string</span><span class="token punctuation">}</span> propertyKey
 * @returns <span class="token punctuation">{</span>PropertyDescriptor<span class="token punctuation">}</span>
 */</code></pre>



<!-- Description -->
## Description

::: v-pre

Get symbol name.

:::