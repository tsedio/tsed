---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation getDecoratorType function
---
# getDecoratorType <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { getDecoratorType }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//core/utils/DecoratorUtils.ts#L0-L0">/core/utils/DecoratorUtils.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">getDecoratorType</span><span class="token punctuation">(</span>
  args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  longType<span class="token punctuation"> = </span>false
<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token string">"parameter"</span> | "parameter.<span class="token keyword">constructor</span>" | "parameter.<span class="token keyword">static</span>" | "property" | "property.<span class="token keyword">static</span>" | "method" | "method.<span class="token keyword">static</span>" | "<span class="token keyword">class</span>" <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">]</span><span class="token punctuation"> = </span>args<span class="token punctuation">;</span>

  <span class="token keyword">const</span> staticType<span class="token punctuation"> = </span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>!longType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return type<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    return target !== <span class="token function">getClass</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span> ? type <span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>type + ".<span class="token keyword">static</span>"<span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span>typeof descriptor === "<span class="token keyword">number</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return propertyKey ? <span class="token function">staticType</span><span class="token punctuation">(</span>"parameter"<span class="token punctuation">)</span> <span class="token punctuation">:</span> longType ? "parameter.<span class="token keyword">constructor</span>" <span class="token punctuation">:</span> <span class="token string">"parameter"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span><span class="token punctuation">(</span>propertyKey && descriptor === undefined<span class="token punctuation">)</span> || <span class="token punctuation">(</span>descriptor && <span class="token punctuation">(</span>descriptor.get || descriptor.set<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return <span class="token function">staticType</span><span class="token punctuation">(</span>"property"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return descriptor && descriptor.value ? <span class="token function">staticType</span><span class="token punctuation">(</span>"method"<span class="token punctuation">)</span> <span class="token punctuation">:</span> "<span class="token keyword">class</span>"<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 *
 */</code></pre>