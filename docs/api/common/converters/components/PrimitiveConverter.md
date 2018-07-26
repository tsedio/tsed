---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation PrimitiveConverter class
---
# PrimitiveConverter <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PrimitiveConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/converters/components/PrimitiveConverter"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/converters/components/PrimitiveConverter.ts#L0-L0">/common/converters/components/PrimitiveConverter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> PrimitiveConverter <span class="token keyword">implements</span> <a href="/api/common/converters/interfaces/IConverter.html"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
  <span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> String | Number | Boolean | <span class="token keyword">void</span> <span class="token punctuation">{</span>
    switch <span class="token punctuation">(</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      case String<span class="token punctuation">:</span>
        return "" + data<span class="token punctuation">;</span>
      case Number<span class="token punctuation">:</span>
        <span class="token keyword">const</span> n<span class="token punctuation"> = </span>+data<span class="token punctuation">;</span>
        if <span class="token punctuation">(</span><span class="token function">isNaN</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          throw new <span class="token function">BadRequest</span><span class="token punctuation">(</span>"Cast error. Expression value is not a <span class="token keyword">number</span>."<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        return n<span class="token punctuation">;</span>
      case Boolean<span class="token punctuation">:</span>
        if <span class="token punctuation">(</span>data === <span class="token string">"true"</span><span class="token punctuation">)</span> return true<span class="token punctuation">;</span>
        if <span class="token punctuation">(</span>data === <span class="token string">"false"</span><span class="token punctuation">)</span> return false<span class="token punctuation">;</span>
        return !!data<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> String | Number | Boolean<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    return object<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Converter component for the `String`, `Number` and `Boolean` Types.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> String | Number | Boolean | <span class="token keyword">void</span> <span class="token punctuation">{</span>
 switch <span class="token punctuation">(</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   case String<span class="token punctuation">:</span>
     return "" + data<span class="token punctuation">;</span>
   case Number<span class="token punctuation">:</span>
     <span class="token keyword">const</span> n<span class="token punctuation"> = </span>+data<span class="token punctuation">;</span>
     if <span class="token punctuation">(</span><span class="token function">isNaN</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
       throw new <span class="token function">BadRequest</span><span class="token punctuation">(</span>"Cast error. Expression value is not a <span class="token keyword">number</span>."<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
     return n<span class="token punctuation">;</span>
   case Boolean<span class="token punctuation">:</span>
     if <span class="token punctuation">(</span>data === <span class="token string">"true"</span><span class="token punctuation">)</span> return true<span class="token punctuation">;</span>
     if <span class="token punctuation">(</span>data === <span class="token string">"false"</span><span class="token punctuation">)</span> return false<span class="token punctuation">;</span>
     return !!data<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> String | Number | Boolean<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 return object<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::