---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation swaggerApplyType function
---
# swaggerApplyType <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { swaggerApplyType }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/utils/index"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//swagger/utils/index.ts#L0-L0">/swagger/utils/index.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">swaggerApplyType</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> types<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span>
    .<span class="token function">concat</span><span class="token punctuation">(</span><span class="token function">swaggerType</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>
    .<span class="token function">filter</span><span class="token punctuation">(</span>type =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>type === <span class="token string">"null"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        schema.nullable<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>

        return false<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      return type<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    .<span class="token function">map</span><span class="token punctuation">(</span>type =&gt<span class="token punctuation">;</span> <span class="token function">String</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span>types.length === 1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    schema.type<span class="token punctuation"> = </span>types<span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
    delete schema.type<span class="token punctuation">;</span>
    schema.oneOf<span class="token punctuation"> = </span>types.<span class="token function">map</span><span class="token punctuation">(</span>type =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>type<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return schema<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 *
 * @returns <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
 */</code></pre>



<!-- Description -->
## Description

::: v-pre

Filter the null type, unsupported by swagger and apply the right type on schema.

:::