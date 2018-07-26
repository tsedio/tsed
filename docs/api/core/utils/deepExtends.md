---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation deepExtends function
---
# deepExtends <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { deepExtends }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//core/utils/deepExtends.ts#L0-L0">/core/utils/deepExtends.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">deepExtends</span><span class="token punctuation">(</span>out<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> reducers<span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">}</span><span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>obj === undefined || obj === null<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return obj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span><span class="token function">isPrimitiveOrPrimitiveClass</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span> || typeof obj === <span class="token string">"symbol"</span> || typeof obj === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return obj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    out<span class="token punctuation"> = </span>out || <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
    out<span class="token punctuation"> = </span>out || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> defaultReducer<span class="token punctuation"> = </span>reducers<span class="token punctuation">[</span>"default"<span class="token punctuation">]</span>
    ? reducers<span class="token punctuation">[</span>"default"<span class="token punctuation">]</span>
    <span class="token punctuation">:</span> <span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        collection.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>

        return collection<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> set<span class="token punctuation"> = </span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      out.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      out<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  Object.<span class="token function">keys</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> value<span class="token punctuation"> = </span>obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>

    if <span class="token punctuation">(</span>value === undefined || value === null<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    if <span class="token punctuation">(</span>value === "" && out<span class="token punctuation">[</span>key<span class="token punctuation">]</span> !== ""<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    if <span class="token punctuation">(</span><span class="token function">isPrimitiveOrPrimitiveClass</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> || typeof value === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>

      return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      value<span class="token punctuation"> = </span>value.<span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">deepExtends</span><span class="token punctuation">(</span>undefined<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token function">set</span><span class="token punctuation">(</span>
        key<span class="token punctuation">,</span>
        <span class="token punctuation">[</span><span class="token punctuation">]</span>
          .<span class="token function">concat</span><span class="token punctuation">(</span>out<span class="token punctuation">[</span>key<span class="token punctuation">]</span> || <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
          .<span class="token function">reduce</span><span class="token punctuation">(</span>
            <span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>reducers<span class="token punctuation">[</span>key<span class="token punctuation">]</span> ? reducers<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">(</span>collection<span class="token punctuation">,</span> value<span class="token punctuation">)</span> <span class="token punctuation">:</span> <span class="token function">defaultReducer</span><span class="token punctuation">(</span>collection<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
            <span class="token punctuation">[</span><span class="token punctuation">]</span>
          <span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>

      return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    // Object
    if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token function">deepExtends</span><span class="token punctuation">(</span>undefined<span class="token punctuation">,</span> value<span class="token punctuation">,</span> reducers<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token function">deepExtends</span><span class="token punctuation">(</span>out<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">,</span> reducers<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>out<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    out.<span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>collection<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token function">defaultReducer</span><span class="token punctuation">(</span>collection<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return out<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>