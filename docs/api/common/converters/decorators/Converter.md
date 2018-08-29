---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Converter decorator
---
# Converter <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Converter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/converters/decorators/converter.ts#L0-L0">/common/converters/decorators/converter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Converter</span><span class="token punctuation">(</span>...classes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    /* istanbul ignore next */
    if <span class="token punctuation">(</span>classes.length === 0<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      throw new <span class="token function">Error</span><span class="token punctuation">(</span>"Converter decorator need at least one type like String<span class="token punctuation">,</span> <span class="token keyword">Date</span><span class="token punctuation">,</span> Class<span class="token punctuation">,</span> etc..."<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">registerConverter</span><span class="token punctuation">(</span><span class="token punctuation">{</span>provide<span class="token punctuation">:</span> target<span class="token punctuation">,</span> type<span class="token punctuation">:</span> <span class="token string">"converter"</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    classes.<span class="token function">forEach</span><span class="token punctuation">(</span>clazz =&gt<span class="token punctuation">;</span> <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/common/converters/constants/CONVERTER.html"><span class="token">CONVERTER</span></a><span class="token punctuation">,</span> target<span class="token punctuation">,</span> clazz<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

`@Converter(...targetTypes)` let you to define some converters for a certain type/Class.
It useful for a generic conversion.


:::