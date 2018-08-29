---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation getReducers function
---
# getReducers <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { getReducers }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/utils/index"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//swagger/utils/index.ts#L0-L0">/swagger/utils/index.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">getReducers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">}</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> defaultReducer<span class="token punctuation"> = </span><span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>collection.<span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> === -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      collection.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    return collection<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  return <span class="token punctuation">{</span>
    default<span class="token punctuation">:</span> defaultReducer<span class="token punctuation">,</span>
    security<span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">,</span> value<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> current<span class="token punctuation"> = </span>collection.<span class="token function">find</span><span class="token punctuation">(</span>
        <span class="token punctuation">(</span>current<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
          return Object.<span class="token function">keys</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>.<span class="token function">find</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> !!current<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>current<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">deepExtends</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> value<span class="token punctuation">,</span> <span class="token punctuation">{</span>default<span class="token punctuation">:</span> defaultReducer<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        collection.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      return collection<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    parameters<span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">,</span> value<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> current<span class="token punctuation"> = </span>collection.<span class="token function">find</span><span class="token punctuation">(</span>current =&gt<span class="token punctuation">;</span> current.in === value.in && current.name === value.name<span class="token punctuation">)</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>current<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">deepExtends</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        collection.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      return collection<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    oneOf<span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">,</span> value<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> current<span class="token punctuation"> = </span>collection.<span class="token function">find</span><span class="token punctuation">(</span>current =&gt<span class="token punctuation">;</span> current.type === value.type<span class="token punctuation">)</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>current<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">deepExtends</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        collection.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      return collection<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>